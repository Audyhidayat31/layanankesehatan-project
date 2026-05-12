'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, CreditCard, CheckCircle } from 'lucide-react'
import { useCartStore, useAuthStore, useAppStore } from '@/lib/store'
import { mockPharmacies } from '@/lib/mock-data'

export default function CartPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { items, removeItem, updateQuantity, clearCart, getTotalAmount } = useCartStore()
  const { createOrder } = useAppStore()
  
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false)
  const [successDialogOpen, setSuccessDialogOpen] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const totalAmount = getTotalAmount()
  const shippingCost = totalAmount > 100000 ? 0 : 15000
  const grandTotal = totalAmount + shippingCost

  const handleCheckout = async () => {
    if (!isAuthenticated || !user) {
      router.push('/login')
      return
    }

    if (!address.trim()) {
      return
    }

    setIsCheckingOut(true)
    try {
      const orderId = `ord-${Date.now()}`

      // 1. Buat transaksi di DB
      const checkoutRes = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          amount: grandTotal,
          orderId: orderId,
        }),
      })

      const checkoutData = await checkoutRes.json()
      if (!checkoutData.success) {
        throw new Error(checkoutData.message || 'Gagal membuat transaksi')
      }

      // 2. Dapatkan token Snap Midtrans
      const tokenRes = await fetch('/api/payments/create-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId: checkoutData.transactionId }),
      })

      const tokenData = await tokenRes.json()
      if (!tokenData.success) {
        throw new Error(tokenData.message || 'Gagal mendapatkan token pembayaran')
      }

      // 3. Tampilkan popup Midtrans
      if ((window as any).snap) {
        ;(window as any).snap.pay(tokenData.token, {
          onSuccess: async function (result: any) {
            // Setelah sukses bayar, simpan order
            createOrder({
              patientId: `pat-${user.id}`,
              pharmacyId: mockPharmacies[0].id,
              pharmacy: mockPharmacies[0],
              items: items.map((item) => ({
                medicineId: item.medicine.id,
                medicine: item.medicine,
                quantity: item.quantity,
                price: item.medicine.price * item.quantity,
              })),
              totalAmount: grandTotal,
              status: 'processing',
              shippingAddress: address,
              paymentStatus: 'paid',
            })

            try {
              await fetch('/api/payments/sync-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: checkoutData.transactionId }),
              })
            } catch (e) {
              console.error('Failed to sync status', e)
            }

            clearCart()
            setCheckoutDialogOpen(false)
            setSuccessDialogOpen(true)
          },
          onPending: async function (result: any) {
            console.log('Payment pending', result)
            try {
              await fetch('/api/payments/sync-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: checkoutData.transactionId }),
              })
            } catch (e) {
              console.error('Failed to sync status', e)
            }
            alert('Menunggu pembayaran Anda.')
            setCheckoutDialogOpen(false)
          },
          onError: async function (result: any) {
            console.error('Payment error detail:', result)
            try {
              await fetch('/api/payments/sync-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: checkoutData.transactionId }),
              })
            } catch (e) {
              console.error('Failed to sync status', e)
            }
            alert('Pembayaran gagal: ' + (result?.status_message || 'Silakan coba lagi.'))
          },
          onClose: function () {
            console.log('customer closed the popup without finishing the payment')
          }
        })
      } else {
        console.error('Midtrans Snap is not loaded')
        alert('Gagal memuat sistem pembayaran.')
      }
    } catch (error: any) {
      console.error('Checkout failed:', error)
      alert(error.message || 'Terjadi kesalahan saat checkout')
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (items.length === 0 && !successDialogOpen) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center bg-muted/30">
          <div className="text-center">
            <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-muted-foreground/50" />
            <h1 className="mb-2 text-2xl font-bold text-foreground">Keranjang Kosong</h1>
            <p className="mb-6 text-muted-foreground">
              Anda belum menambahkan produk ke keranjang
            </p>
            <Button asChild>
              <Link href="/pharmacy">Mulai Belanja</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" className="mb-6" asChild>
            <Link href="/pharmacy">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Lanjut Belanja
            </Link>
          </Button>

          <h1 className="mb-6 text-2xl font-bold text-foreground">Keranjang Belanja</h1>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.medicine.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-muted mx-auto sm:mx-0">
                        <ShoppingBag className="h-8 w-8 text-muted-foreground/50" />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="font-semibold text-foreground line-clamp-1">{item.medicine.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.medicine.unit}</p>
                        <p className="text-sm font-medium text-primary">
                          {formatPrice(item.medicine.price)}
                        </p>
                      </div>
                      <div className="flex items-center justify-center gap-3 py-2 sm:py-0">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => updateQuantity(item.medicine.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => updateQuantity(item.medicine.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between sm:block sm:w-32 sm:text-right border-t sm:border-none pt-3 sm:pt-0">
                        <span className="text-sm text-muted-foreground sm:hidden">Total:</span>
                        <span className="font-bold text-foreground">
                          {formatPrice(item.medicine.price * item.quantity)}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 sm:static text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.medicine.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Ringkasan Pesanan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal ({items.length} item)</span>
                      <span>{formatPrice(totalAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Ongkos Kirim</span>
                      <span>{shippingCost === 0 ? 'Gratis' : formatPrice(shippingCost)}</span>
                    </div>
                    {totalAmount < 100000 && (
                      <p className="text-xs text-muted-foreground">
                        Belanja min. Rp100.000 untuk gratis ongkir
                      </p>
                    )}
                  </div>
                  <hr className="border-border" />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(grandTotal)}</span>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => setCheckoutDialogOpen(true)}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Checkout
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <Dialog open={checkoutDialogOpen} onOpenChange={setCheckoutDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
            <DialogDescription>
              Masukkan alamat pengiriman untuk menyelesaikan pesanan
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="address">Alamat Pengiriman</FieldLabel>
                <Textarea
                  id="address"
                  placeholder="Masukkan alamat lengkap..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="notes">Catatan (opsional)</FieldLabel>
                <Input
                  id="notes"
                  placeholder="Catatan untuk kurir..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </Field>
            </FieldGroup>

            <div className="rounded-lg bg-muted p-4">
              <div className="flex justify-between font-semibold">
                <span>Total Pembayaran</span>
                <span className="text-primary">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={handleCheckout}
              disabled={!address.trim() || isCheckingOut}
            >
              {isCheckingOut ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Memproses...
                </>
              ) : (
                'Bayar Sekarang'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader className="items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-xl font-bold text-foreground">Pesanan Berhasil!</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Pesanan Anda sedang diproses dan akan segera dikirim
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-2">
            <div className="mt-4 flex gap-3">
              <Button variant="outline" asChild>
                <Link href="/pharmacy">Lanjut Belanja</Link>
              </Button>
              <Button asChild>
                <Link href="/patient/orders">Lihat Pesanan</Link>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
