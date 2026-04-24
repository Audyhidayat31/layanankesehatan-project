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
  Pill,
  ShoppingBag,
  DollarSign,
  Download,
  Calendar,
  ArrowUpRight,
} from 'lucide-react'

export default function PharmacyReportsPage() {
  const [timeRange, setTimeRange] = useState('monthly')

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar role="pharmacy" />
      <DashboardHeader role="pharmacy" />
      
      <main className="lg:pl-64">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Laporan Penjualan</h1>
              <p className="text-muted-foreground">
                Pantau performa penjualan dan stok obat apotek Anda
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
                Ekspor Laporan
              </Button>
            </div>
          </div>

          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Penjualan</p>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-xl font-bold">Rp 45.2M</h3>
                      <span className="flex items-center text-xs text-green-600">
                        <ArrowUpRight className="h-3 w-3" /> 15%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pesanan Selesai</p>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-xl font-bold">1,240</h3>
                      <span className="flex items-center text-xs text-green-600">
                        <ArrowUpRight className="h-3 w-3" /> 8%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                    <Pill className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Produk Terjual</p>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-xl font-bold">5,620</h3>
                      <span className="flex items-center text-xs text-green-600">
                        <ArrowUpRight className="h-3 w-3" /> 12%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Obat Terlaris</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { name: 'Paracetamol 500mg', sales: 450, stock: 120, color: 'bg-primary' },
                    { name: 'Amoxicillin 500mg', sales: 320, stock: 45, color: 'bg-blue-500' },
                    { name: 'Vitamin C 1000mg', sales: 280, stock: 88, color: 'bg-orange-500' },
                    { name: 'Obat Batuk Syrup', sales: 210, stock: 15, color: 'bg-red-500' },
                  ].map((item) => (
                    <div key={item.name} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">{item.name}</span>
                        <span className="text-muted-foreground">{item.sales} terjual</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div 
                          className={`h-2 rounded-full ${item.color}`} 
                          style={{ width: `${(item.sales / 500) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Statistik Stok</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex h-[250px] flex-col items-center justify-center gap-4 text-center">
                  <div className="relative h-40 w-40">
                    {/* Simplified donut chart visualization */}
                    <div className="absolute inset-0 rounded-full border-[15px] border-muted" />
                    <div className="absolute inset-0 rounded-full border-[15px] border-primary border-t-transparent border-r-transparent" style={{ transform: 'rotate(45deg)' }} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold">85%</span>
                      <span className="text-[10px] text-muted-foreground text-center px-4 leading-tight">Stok Aman</span>
                    </div>
                  </div>
                  <div className="flex gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span>Tersedia</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-red-500" />
                      <span>Kritis</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-muted" />
                      <span>Kosong</span>
                    </div>
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
