'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Calendar,
  Pill,
  MessageSquare,
  FileText,
  Clock,
  ArrowRight,
  Video,
  Building,
  CheckCircle,
} from 'lucide-react'
import { useAuthStore, useAppStore } from '@/lib/store'
import { useState, useEffect } from 'react'

export default function PatientDashboardPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const { user } = useAuthStore()
  const { getAppointmentsByPatient, getOrdersByPatient, getUnreadCount, appointments: storeAppointments, orders: storeOrders, refreshData } = useAppStore()
  
  useEffect(() => {
    setMounted(true)
    
    if (!user) {
      router.replace('/')
      return
    }

    if (user?.id) {
      refreshData(user.id, 'patient')
      
      // Auto-refresh patient data every 5 seconds for a real-time experience
      const interval = setInterval(() => {
        refreshData(user.id, 'patient')
      }, 5000)
      
      return () => clearInterval(interval)
    }
  }, [user, router, refreshData])

  if (!mounted) {
    return null
  }

  const patientId = user ? `pat-${user.id}` : ''
  const appointments = getAppointmentsByPatient(patientId)
  const orders = getOrdersByPatient(patientId)
  const unreadMessages = user ? getUnreadCount(user.id) : 0

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter((n) => !n.startsWith('Dr'))
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'completed':
        return 'bg-blue-100 text-blue-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      case 'processing':
        return 'bg-orange-100 text-orange-700'
      case 'delivered':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Menunggu',
      confirmed: 'Dikonfirmasi',
      completed: 'Selesai',
      cancelled: 'Dibatalkan',
      processing: 'Sudah Terbayar',
      shipped: 'Dikirim',
      delivered: 'Diterima',
    }
    return labels[status] || status
  }

  const upcomingAppointments = appointments
    .filter((apt) => apt.status === 'confirmed' || apt.status === 'pending')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3)

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

  const stats = [
    {
      label: 'Total Konsultasi',
      value: appointments.length,
      icon: Calendar,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Pesanan Obat',
      value: orders.length,
      icon: Pill,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      label: 'Pesan Belum Dibaca',
      value: unreadMessages || 0,
      icon: MessageSquare,
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/10',
    },
    {
      label: 'Rekam Medis',
      value: 5,
      icon: FileText,
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/10',
    },
  ]

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar role="patient" />
      <DashboardHeader role="patient" />
      
      <main className="lg:pl-64">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">
              Selamat datang, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-muted-foreground">
              Kelola kesehatan Anda dengan mudah dari dashboard ini
            </p>
          </div>

          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mb-8 grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Konsultasi Mendatang
                </CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/patient/appointments">
                    Lihat Semua <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="flex items-center gap-4 rounded-lg border border-border p-4"
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(apt.doctor.user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-foreground">
                            {apt.doctor.user.name}
                          </h4>
                          <Badge variant="secondary" className={getStatusColor(apt.status)}>
                            {getStatusLabel(apt.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {apt.doctor.specialization}
                        </p>
                        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {apt.date} - {apt.time}
                          </span>
                          <span className="flex items-center gap-1">
                            {apt.type === 'online' ? (
                              <>
                                <Video className="h-3 w-3" />
                                Online
                              </>
                            ) : (
                              <>
                                <Building className="h-3 w-3" />
                                Offline
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                      {apt.status === 'confirmed' && apt.type === 'online' && (
                        <Button size="sm">
                          <Video className="mr-1 h-4 w-4" />
                          Mulai
                        </Button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    <Calendar className="mx-auto mb-2 h-8 w-8 opacity-50" />
                    <p>Tidak ada konsultasi mendatang</p>
                    <Button variant="outline" size="sm" className="mt-2" asChild>
                      <Link href="/doctors">Cari Dokter</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-accent" />
                  Pesanan Terbaru
                </CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/patient/orders">
                    Lihat Semua <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between rounded-lg border border-border p-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-foreground">#{order.id}</h4>
                          <Badge variant="secondary" className={getStatusColor(order.status)}>
                            {getStatusLabel(order.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {order.items.length} item - {order.createdAt}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">
                          {formatPrice(order.totalAmount)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    <Pill className="mx-auto mb-2 h-8 w-8 opacity-50" />
                    <p>Belum ada pesanan</p>
                    <Button variant="outline" size="sm" className="mt-2" asChild>
                      <Link href="/pharmacy">Beli Obat</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="cursor-pointer transition-all hover:shadow-md">
              <Link href="/doctors">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <Calendar className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Buat Janji Konsultasi</h3>
                    <p className="text-sm text-muted-foreground">
                      Temukan dokter dan jadwalkan konsultasi
                    </p>
                  </div>
                </CardContent>
              </Link>
            </Card>

            <Card className="cursor-pointer transition-all hover:shadow-md">
              <Link href="/pharmacy">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
                    <Pill className="h-7 w-7 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Beli Obat</h3>
                    <p className="text-sm text-muted-foreground">
                      Pesan obat dari apotek terverifikasi
                    </p>
                  </div>
                </CardContent>
              </Link>
            </Card>

            <Card className="cursor-pointer transition-all hover:shadow-md">
              <Link href="/patient/chat">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-chart-3/10">
                    <MessageSquare className="h-7 w-7 text-chart-3" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Chat dengan Dokter</h3>
                    <p className="text-sm text-muted-foreground">
                      Lanjutkan konsultasi via chat
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
