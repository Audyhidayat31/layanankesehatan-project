'use client'

import { useState } from 'react'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CreditCard, Calendar, Package, ArrowRight, ArrowDownLeft } from 'lucide-react'
import { mockTransactions } from '@/lib/mock-data'

export default function PatientTransactionsPage() {
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
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'paid': return 'bg-green-100 text-green-700'
      case 'failed': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Menunggu',
      paid: 'Berhasil',
      failed: 'Gagal',
    }
    return labels[status] || status
  }

  const filteredTransactions = mockTransactions.filter((trx) => {
    if (activeTab === 'all') return true
    if (activeTab === 'appointments') return trx.type === 'appointment'
    if (activeTab === 'orders') return trx.type === 'order'
    return true
  })

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar role="patient" />
      <DashboardHeader role="patient" />
      
      <main className="lg:pl-64">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Riwayat Transaksi</h1>
            <p className="text-muted-foreground">
              Pantau semua transaksi konsultasi dan pembelian obat Anda
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">Semua</TabsTrigger>
              <TabsTrigger value="appointments">Konsultasi</TabsTrigger>
              <TabsTrigger value="orders">Pesanan Obat</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((trx) => (
                  <Card key={trx.id}>
                    <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start md:items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          {trx.type === 'appointment' ? (
                            <Calendar className="h-6 w-6 text-primary" />
                          ) : (
                            <Package className="h-6 w-6 text-primary" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-foreground">
                              {trx.type === 'appointment' ? 'Konsultasi Dokter' : 'Pembelian Obat'}
                            </p>
                            <Badge variant="secondary" className={getStatusColor(trx.status)}>
                              {getStatusLabel(trx.status)}
                            </Badge>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <span className="font-mono text-xs">#{trx.id}</span>
                            </span>
                            <span className="hidden sm:inline">•</span>
                            <span>{trx.createdAt}</span>
                            <span className="hidden sm:inline">•</span>
                            <span className="flex items-center gap-1">
                              <CreditCard className="h-3 w-3" />
                              {trx.paymentMethod}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4 md:gap-6 mt-4 md:mt-0 border-t md:border-t-0 border-border pt-4 md:pt-0">
                        <div className="text-right flex items-center gap-2">
                          <ArrowDownLeft className="h-4 w-4 text-red-500" />
                          <p className="text-lg font-bold text-foreground">
                            {formatPrice(trx.amount)}
                          </p>
                        </div>
                        <Button variant="ghost" size="icon">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center bg-card rounded-lg border border-border">
                  <CreditCard className="mb-4 h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mb-2 text-lg font-medium text-foreground">
                    Tidak ada transaksi
                  </h3>
                  <p className="text-muted-foreground">
                    Belum ada riwayat transaksi dalam kategori ini.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
