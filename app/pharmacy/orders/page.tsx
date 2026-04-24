'use client'

import { useState } from 'react'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  MapPin,
  Eye,
} from 'lucide-react'

const initialOrders = [
  { id: 'ORD-1001', patient: 'Budi Santoso', items: 'Paracetamol, Amoxicillin', total: 125000, status: 'pending', date: '2024-04-23 10:30', address: 'Jl. Melati No. 5, Jakarta' },
  { id: 'ORD-1002', patient: 'Siti Aminah', items: 'Vitamin C, Masker Medis', total: 45000, status: 'processing', date: '2024-04-23 11:15', address: 'Apartemen Green View, Jakarta' },
  { id: 'ORD-1003', patient: 'Andi Pratama', items: 'Obat Batuk Syrup', total: 35000, status: 'shipped', date: '2024-04-22 14:20', address: 'Perum Gading Serpong, Tangerang' },
  { id: 'ORD-1004', patient: 'Dewi Lestari', items: 'Insulin Pen, Glukometer', total: 850000, status: 'delivered', date: '2024-04-21 09:00', address: 'Jl. Diponegoro No. 12, Bekasi' },
]

export default function PharmacyOrdersPage() {
  const [orders, setOrders] = useState(initialOrders)
  const [searchQuery, setSearchQuery] = useState('')

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Menunggu</Badge>
      case 'processing':
        return <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-blue-200">Diproses</Badge>
      case 'shipped':
        return <Badge variant="secondary" className="bg-purple-50 text-purple-600 border-purple-200">Dikirim</Badge>
      case 'delivered':
        return <Badge className="bg-green-100 text-green-700">Diterima</Badge>
      case 'cancelled':
        return <Badge variant="destructive">Dibatalkan</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o))
  }

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.patient.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar role="pharmacy" />
      <DashboardHeader role="pharmacy" />
      
      <main className="lg:pl-64">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Pesanan Obat</h1>
            <p className="text-muted-foreground">
              Kelola dan proses pesanan obat dari pasien
            </p>
          </div>

          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari ID pesanan atau nama pasien..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Pesanan</TableHead>
                  <TableHead>Pasien</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs font-bold">{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.patient}</p>
                        <p className="text-xs text-muted-foreground">{order.date}</p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                      {order.items}
                    </TableCell>
                    <TableCell className="font-semibold text-primary">
                      {formatPrice(order.total)}
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {order.status === 'pending' && (
                          <Button size="sm" onClick={() => handleUpdateStatus(order.id, 'processing')}>
                            Proses
                          </Button>
                        )}
                        {order.status === 'processing' && (
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700" onClick={() => handleUpdateStatus(order.id, 'shipped')}>
                            <Truck className="mr-1 h-4 w-4" />
                            Kirim
                          </Button>
                        )}
                        {order.status === 'shipped' && (
                          <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(order.id, 'delivered')}>
                            Selesai
                          </Button>
                        )}
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
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
