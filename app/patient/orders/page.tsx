'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react'
import { mockOrders } from '@/lib/mock-data'

export default function PatientOrdersPage() {
  const [activeTab, setActiveTab] = useState('all')

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'processing':
        return 'bg-blue-100 text-blue-700'
      case 'shipped':
        return 'bg-purple-100 text-purple-700'
      case 'delivered':
        return 'bg-green-100 text-green-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Menunggu Pembayaran',
      processing: 'Diproses',
      shipped: 'Dikirim',
      delivered: 'Diterima',
      cancelled: 'Dibatalkan',
    }
    return labels[status] || status
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'processing':
        return <Package className="h-4 w-4" />
      case 'shipped':
        return <Truck className="h-4 w-4" />
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />
      case 'cancelled':
        return <XCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const filteredOrders = mockOrders.filter((order) => {
    if (activeTab === 'all') return true
    if (activeTab === 'active') return ['pending', 'processing', 'shipped'].includes(order.status)
    if (activeTab === 'completed') return order.status === 'delivered'
    if (activeTab === 'cancelled') return order.status === 'cancelled'
    return true
  })

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar role="patient" />
      <DashboardHeader role="patient" />
      
      <main className="lg:pl-64">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Pesanan Obat</h1>
              <p className="text-muted-foreground">
                Lacak dan kelola pesanan obat Anda
              </p>
            </div>
            <Button asChild>
              <Link href="/pharmacy">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Beli Obat
              </Link>
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">Semua</TabsTrigger>
              <TabsTrigger value="active">Aktif</TabsTrigger>
              <TabsTrigger value="completed">Selesai</TabsTrigger>
              <TabsTrigger value="cancelled">Dibatalkan</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-6">
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm text-muted-foreground">
                            #{order.id}
                          </span>
                          <Badge variant="secondary" className={getStatusColor(order.status)}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{getStatusLabel(order.status)}</span>
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">{order.createdAt}</span>
                      </div>

                      <div className="mb-4 space-y-3">
                        {order.items.map((item) => (
                          <div key={item.medicineId} className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                              <Package className="h-6 w-6 text-muted-foreground/50" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-foreground">
                                {item.medicine.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {item.quantity}x {formatPrice(item.medicine.price)}
                              </p>
                            </div>
                            <p className="font-medium text-foreground">
                              {formatPrice(item.price)}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="mb-4 flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>{order.shippingAddress}</span>
                      </div>

                      <div className="flex flex-col items-start justify-between gap-4 border-t border-border pt-4 sm:flex-row sm:items-center">
                        <div>
                          <span className="text-sm text-muted-foreground">Total Pembayaran</span>
                          <p className="text-xl font-bold text-primary">
                            {formatPrice(order.totalAmount)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {order.status === 'shipped' && (
                            <Button>
                              <Truck className="mr-1 h-4 w-4" />
                              Lacak Pesanan
                            </Button>
                          )}
                          {order.status === 'delivered' && (
                            <Button variant="outline">
                              Beli Lagi
                            </Button>
                          )}
                          {order.status === 'pending' && (
                            <>
                              <Button variant="outline">Batalkan</Button>
                              <Button>Bayar Sekarang</Button>
                            </>
                          )}
                          <Button variant="ghost" size="icon">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Package className="mb-4 h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mb-2 text-lg font-medium text-foreground">
                    Tidak ada pesanan
                  </h3>
                  <p className="mb-4 text-muted-foreground">
                    Anda belum memiliki riwayat pesanan dalam kategori ini
                  </p>
                  <Button asChild>
                    <Link href="/pharmacy">Beli Obat Sekarang</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
