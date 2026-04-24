'use client'

import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Users,
  Stethoscope,
  Pill,
  CreditCard,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const stats = [
  {
    label: 'Total Pengguna',
    value: '2,543',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    label: 'Dokter Aktif',
    value: '184',
    change: '+3.2%',
    trend: 'up',
    icon: Stethoscope,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    label: 'Apotek Mitra',
    value: '56',
    change: '+8.1%',
    trend: 'up',
    icon: Pill,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    label: 'Pendapatan Platform',
    value: 'Rp 145.2M',
    change: '+14.2%',
    trend: 'up',
    icon: CreditCard,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
]

const recentActivities = [
  { id: 1, user: 'dr. Ahmad Salim', action: 'Mengajukan verifikasi profil', time: '2 jam yang lalu', status: 'pending' },
  { id: 2, user: 'Apotek Kimia Farma', action: 'Menambah 15 produk baru', time: '3 jam yang lalu', status: 'completed' },
  { id: 3, user: 'Budi Santoso', action: 'Melakukan transaksi konsultasi', time: '5 jam yang lalu', status: 'completed' },
  { id: 4, user: 'Siti Aminah', action: 'Membatalkan pesanan obat', time: '6 jam yang lalu', status: 'cancelled' },
  { id: 5, user: 'dr. Sarah Wijaya', action: 'Memperbarui tarif konsultasi', time: '1 hari yang lalu', status: 'completed' },
]

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar role="admin" />
      <DashboardHeader role="admin" />
      
      <main className="lg:pl-64">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Ringkasan statistik dan aktivitas platform HealthServices
            </p>
          </div>

          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
                      <span className={`flex items-center text-xs font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Aktivitas Terbaru
                </CardTitle>
                <Badge variant="outline">Real-time</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4">
                      <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-foreground">{activity.user}</p>
                          <span className="text-xs text-muted-foreground">{activity.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{activity.action}</p>
                      </div>
                      <Badge 
                        variant={activity.status === 'completed' ? 'secondary' : activity.status === 'pending' ? 'outline' : 'destructive'}
                        className="text-[10px] uppercase"
                      >
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  Butuh Verifikasi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border border-border p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold">
                        SW
                      </div>
                      <div>
                        <p className="text-sm font-medium">dr. Sarah Wijaya</p>
                        <p className="text-xs text-muted-foreground">Spesialis Jantung</p>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button className="flex-1 rounded-md bg-primary py-1.5 text-xs font-medium text-white hover:bg-primary/90">
                        Verifikasi
                      </button>
                      <button className="flex-1 rounded-md bg-muted py-1.5 text-xs font-medium text-foreground hover:bg-muted/80">
                        Detail
                      </button>
                    </div>
                  </div>

                  <div className="rounded-lg border border-border p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700">
                        <Pill className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Apotek Sumber Sehat</p>
                        <p className="text-xs text-muted-foreground">Surabaya</p>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button className="flex-1 rounded-md bg-primary py-1.5 text-xs font-medium text-white hover:bg-primary/90">
                        Verifikasi
                      </button>
                      <button className="flex-1 rounded-md bg-muted py-1.5 text-xs font-medium text-foreground hover:bg-muted/80">
                        Detail
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-1 rounded-lg border border-dashed border-border p-4 text-xs text-muted-foreground">
                    <AlertCircle className="h-3 w-3" />
                    Belum ada pengajuan lainnya
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
