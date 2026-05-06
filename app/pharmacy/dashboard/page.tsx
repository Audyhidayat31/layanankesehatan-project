'use client'

import Link from 'next/link'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Package,
  ShoppingCart,
  DollarSign,
  Pill,
  ArrowRight,
  Clock,
  CheckCircle,
  Truck,
  AlertTriangle,
  TrendingUp,
  Star,
} from 'lucide-react'
import { useAuthStore, useAppStore } from '@/lib/store'
import { useState, useEffect, useMemo } from 'react'
import { mockPharmacies } from '@/lib/mock-data'

export default function PharmacyDashboardPage() {
  const [mounted, setMounted] = useState(false)
  const { user } = useAuthStore()
  const { orders: allOrders, getMedicines } = useAppStore()
  const [isOpen, setIsOpen] = useState(true)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  // Find pharmacy profile for the current user
  const pharmacyProfile = useMemo(() => 
    user ? mockPharmacies.find(p => p.userId === user.id) : null,
  [user])
  
  const pharmacyId = pharmacyProfile?.id || 'pharm-1'
  
  const orders = useMemo(() => {
    return allOrders.filter(o => o.pharmacyId === pharmacyId)
  }, [allOrders, pharmacyId])

  const medicines = getMedicines()

  if (!mounted) {
    return null
  }
  
  const pharmacy = pharmacyProfile || {
    name: 'Apotek Sehat Selalu',
    address: 'Jl. Thamrin No. 100, Jakarta Pusat',
    city: 'Jakarta',
    operatingHours: '08:00 - 22:00',
    isVerified: true,
    rating: 4.6,
    reviewCount: 320,
  }
  
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
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Menunggu',
      processing: 'Sudah Terbayar',
      shipped: 'Dikirim',
      delivered: 'Selesai',
    }
    return labels[status] || status
  }

  const pendingOrders = orders.filter((o) => o.status === 'pending' || o.status === 'processing')
  const lowStockMedicines = medicines.filter((m) => m.stock < 20)

  const stats = [
    {
      label: 'Pesanan Baru',
      value: pendingOrders.length,
      icon: ShoppingCart,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Total Produk',
      value: medicines.length,
      icon: Pill,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      label: 'Stok Rendah',
      value: lowStockMedicines.length,
      icon: AlertTriangle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      label: 'Pendapatan Hari Ini',
      value: formatPrice(2450000),
      icon: DollarSign,
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/10',
      isPrice: true,
    },
  ]

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar role="pharmacy" />
      <DashboardHeader role="pharmacy" />
      
      <main className="lg:pl-64">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Dashboard {pharmacy.name}
              </h1>
              <p className="text-muted-foreground">{pharmacy.address}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Status Toko:</span>
                <Switch checked={isOpen} onCheckedChange={setIsOpen} />
                <Badge
                  variant="secondary"
                  className={isOpen ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}
                >
                  {isOpen ? 'Buka' : 'Tutup'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="mb-8 rounded-xl border border-border bg-card p-6">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold text-foreground">{pharmacy.name}</h2>
                  {pharmacy.isVerified && <CheckCircle className="h-5 w-5 text-primary" />}
                </div>
                <p className="text-muted-foreground">{pharmacy.city}</p>
                <p className="text-sm text-muted-foreground">
                  Jam Operasional: {pharmacy.operatingHours}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xl font-bold text-foreground">{pharmacy.rating}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{pharmacy.reviewCount} ulasan</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className={`font-bold text-foreground ${stat.isPrice ? 'text-lg' : 'text-2xl'}`}>
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  Pesanan Terbaru
                </CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/pharmacy/orders">
                    Lihat Semua <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {[...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">#{order.id}</span>
                        <Badge variant="secondary" className={getStatusColor(order.status)}>
                          {getStatusLabel(order.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.items.length} item - {order.createdAt}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">{formatPrice(order.totalAmount)}</p>
                      <Button size="sm" variant="outline" className="mt-1">
                        Proses
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Stok Rendah
                </CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/pharmacy/inventory">
                    Kelola Stok <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {lowStockMedicines.length > 0 ? (
                  lowStockMedicines.map((medicine) => (
                    <div
                      key={medicine.id}
                      className="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 p-4"
                    >
                      <div>
                        <h4 className="font-medium text-foreground">{medicine.name}</h4>
                        <p className="text-sm text-muted-foreground">{medicine.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-destructive">{medicine.stock}</p>
                        <p className="text-xs text-muted-foreground">unit tersisa</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    <Package className="mx-auto mb-2 h-8 w-8 opacity-50" />
                    <p>Semua stok dalam kondisi aman</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Card className="cursor-pointer transition-all hover:shadow-md">
              <Link href="/pharmacy/products">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <Pill className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Kelola Produk</h3>
                    <p className="text-sm text-muted-foreground">
                      Tambah dan edit produk obat
                    </p>
                  </div>
                </CardContent>
              </Link>
            </Card>

            <Card className="cursor-pointer transition-all hover:shadow-md">
              <Link href="/pharmacy/orders">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
                    <Truck className="h-7 w-7 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Pesanan</h3>
                    <p className="text-sm text-muted-foreground">
                      Kelola dan kirim pesanan
                    </p>
                  </div>
                </CardContent>
              </Link>
            </Card>

            <Card className="cursor-pointer transition-all hover:shadow-md">
              <Link href="/pharmacy/reports">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-chart-3/10">
                    <TrendingUp className="h-7 w-7 text-chart-3" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Laporan</h3>
                    <p className="text-sm text-muted-foreground">
                      Lihat statistik penjualan
                    </p>
                  </div>
                </CardContent>
              </Link>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
