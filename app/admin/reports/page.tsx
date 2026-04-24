'use client'

import { useState } from 'react'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  BarChart3,
  TrendingUp,
  Users,
  Stethoscope,
  Pill,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'

export default function AdminReportsPage() {
  const [timeRange, setTimeRange] = useState('monthly')

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar role="admin" />
      <DashboardHeader role="admin" />
      
      <main className="lg:pl-64">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Laporan & Analitik</h1>
              <p className="text-muted-foreground">
                Pantau performa platform dan statistik pertumbuhan
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Pilih Periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Mingguan</SelectItem>
                  <SelectItem value="monthly">Bulanan</SelectItem>
                  <SelectItem value="yearly">Tahunan</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Unduh PDF
              </Button>
            </div>
          </div>

          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <p className="text-sm font-medium text-muted-foreground">Pertumbuhan Pengguna</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold text-foreground">+452</h3>
                  <span className="flex items-center text-xs font-medium text-green-600">
                    <ArrowUpRight className="h-3 w-3" />
                    12%
                  </span>
                </div>
                <div className="mt-4 h-2 w-full rounded-full bg-muted">
                  <div className="h-2 w-[75%] rounded-full bg-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm font-medium text-muted-foreground">Total Konsultasi</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold text-foreground">1,284</h3>
                  <span className="flex items-center text-xs font-medium text-green-600">
                    <ArrowUpRight className="h-3 w-3" />
                    8.4%
                  </span>
                </div>
                <div className="mt-4 h-2 w-full rounded-full bg-muted">
                  <div className="h-2 w-[60%] rounded-full bg-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm font-medium text-muted-foreground">Pesanan Obat</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold text-foreground">3,512</h3>
                  <span className="flex items-center text-xs font-medium text-red-600">
                    <ArrowDownRight className="h-3 w-3" />
                    2.1%
                  </span>
                </div>
                <div className="mt-4 h-2 w-full rounded-full bg-muted">
                  <div className="h-2 w-[45%] rounded-full bg-orange-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm font-medium text-muted-foreground">Tingkat Kepuasan</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold text-foreground">4.8/5.0</h3>
                  <span className="flex items-center text-xs font-medium text-green-600">
                    <ArrowUpRight className="h-3 w-3" />
                    0.2%
                  </span>
                </div>
                <div className="mt-4 h-2 w-full rounded-full bg-muted">
                  <div className="h-2 w-[95%] rounded-full bg-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Statistik Layanan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Konsultasi Umum</span>
                      <span className="font-medium text-foreground">45%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 w-[45%] rounded-full bg-primary" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Spesialis Anak</span>
                      <span className="font-medium text-foreground">25%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 w-[25%] rounded-full bg-blue-500" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Spesialis Penyakit Dalam</span>
                      <span className="font-medium text-foreground">15%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 w-[15%] rounded-full bg-orange-500" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Lainnya</span>
                      <span className="font-medium text-foreground">15%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 w-[15%] rounded-full bg-gray-400" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Distribusi Wilayah</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { city: 'Jakarta', count: 1240, color: 'bg-primary' },
                    { city: 'Surabaya', count: 850, color: 'bg-blue-500' },
                    { city: 'Bandung', count: 620, color: 'bg-orange-500' },
                    { city: 'Medan', count: 430, color: 'bg-green-500' },
                    { city: 'Makassar', count: 310, color: 'bg-purple-500' },
                  ].map((item) => (
                    <div key={item.city} className="flex items-center gap-4">
                      <div className={`h-3 w-3 rounded-full ${item.color}`} />
                      <span className="flex-1 text-sm text-muted-foreground">{item.city}</span>
                      <span className="text-sm font-bold text-foreground">{item.count}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex justify-center">
                   <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      Pertumbuhan tertinggi di wilayah Jakarta (15% bln/bln)
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
