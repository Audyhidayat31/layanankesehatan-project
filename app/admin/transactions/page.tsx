'use client'

import { useState } from 'react'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Search,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  Button,
} from 'lucide-react'

const initialTransactions = [
  { id: 'TRX-001', user: 'Budi Santoso', type: 'KONSULTASI', amount: 150000, date: '2024-04-23', status: 'success', method: 'Transfer Bank' },
  { id: 'TRX-002', user: 'Siti Aminah', type: 'OBAT', amount: 85000, date: '2024-04-23', status: 'success', method: 'E-Wallet' },
  { id: 'TRX-003', user: 'Andi Pratama', type: 'KONSULTASI', amount: 200000, date: '2024-04-22', status: 'pending', method: 'Credit Card' },
  { id: 'TRX-004', user: 'Dewi Lestari', type: 'OBAT', amount: 120000, date: '2024-04-22', status: 'failed', method: 'Transfer Bank' },
  { id: 'TRX-005', user: 'Ahmad Faisal', type: 'KONSULTASI', amount: 150000, date: '2024-04-21', status: 'success', method: 'E-Wallet' },
]

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState(initialTransactions)
  const [searchQuery, setSearchQuery] = useState('')

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Berhasil</Badge>
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">Pending</Badge>
      case 'failed':
        return <Badge variant="destructive">Gagal</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const filteredTransactions = transactions.filter(t => 
    t.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar role="admin" />
      <DashboardHeader role="admin" />
      
      <main className="lg:pl-64">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Daftar Transaksi</h1>
              <p className="text-muted-foreground">
                Pantau semua arus kas dan transaksi dalam platform
              </p>
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Ekspor Laporan
            </Button>
          </div>

          <Card className="mb-6">
            <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari ID transaksi atau nama pengguna..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="ghost">
                <Filter className="mr-2 h-4 w-4" />
                Filter Lanjutan
              </Button>
            </CardContent>
          </Card>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Transaksi</TableHead>
                  <TableHead>Pengguna</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Metode</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((trx) => (
                  <TableRow key={trx.id}>
                    <TableCell className="font-mono text-xs font-bold">{trx.id}</TableCell>
                    <TableCell className="font-medium">{trx.user}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider">
                        {trx.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-primary">
                      {formatPrice(trx.amount)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{trx.method}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{trx.date}</TableCell>
                    <TableCell>{getStatusBadge(trx.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </main>
    </div>
  )
}
