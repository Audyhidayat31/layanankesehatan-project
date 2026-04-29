'use client'

import { useState, useEffect } from 'react'
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

import { useAppStore, useAuthStore } from '@/lib/store'
import { mockPharmacies, mockPatients } from '@/lib/mock-data'
import { useMemo } from 'react'

export default function PharmacyOrdersPage() {
  const [mounted, setMounted] = useState(false)
  const { user, registeredUsers } = useAuthStore()
  const { orders, updateOrderStatus } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  // Find pharmacy profile for the current user
  const pharmacyProfile = useMemo(() => 
    user ? mockPharmacies.find(p => p.userId === user.id) : null,
  [user])
  
  const pharmacyId = pharmacyProfile?.id || 'pharm-1'
  
  // Filter orders reactively
  const pharmacyOrders = useMemo(() => {
    return orders.filter((order) => order.pharmacyId === pharmacyId)
  }, [orders, pharmacyId])

  const getPatientName = (patientId: string) => {
    // Check mock patients first
    const mockPatient = mockPatients.find(p => p.id === patientId || p.userId === patientId.replace('pat-', ''))
    if (mockPatient) return mockPatient.user.name

    // Check registered users in auth store
    const userId = patientId.startsWith('pat-user-') ? patientId.replace('pat-user-', 'user-') : patientId.replace('pat-', '')
    const registeredUser = registeredUsers.find(u => u.id === userId || u.id === patientId)
    if (registeredUser) return registeredUser.name

    return patientId
  }

  const filteredOrders = useMemo(() => {
    return pharmacyOrders
      .filter((o) => {
        const query = searchQuery.toLowerCase()
        const patientName = getPatientName(o.patientId).toLowerCase()
        return (
          o.id.toLowerCase().includes(query) ||
          o.patientId.toLowerCase().includes(query) ||
          patientName.includes(query)
        )
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [pharmacyOrders, searchQuery])

  if (!mounted) {
    return null
  }

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
    updateOrderStatus(id, newStatus as any)
  }

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
                        <p className="font-medium">{getPatientName(order.patientId)}</p>
                        <p className="text-xs text-muted-foreground">{order.createdAt}</p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                      {order.items.map(i => i.medicine.name).join(', ')}
                    </TableCell>
                    <TableCell className="font-semibold text-primary">
                      {formatPrice(order.totalAmount)}
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
