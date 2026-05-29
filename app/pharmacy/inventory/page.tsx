'use client'

import { useState } from 'react'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  Plus,
  AlertTriangle,
  ArrowUpRight,
  ClipboardList,
  RefreshCw,
} from 'lucide-react'

import { useAppStore } from '@/lib/store'

export default function PharmacyInventoryPage() {
  const { medicines, updateMedicineStock } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')

  const lowStockItems = medicines.filter(m => m.stock < 20)

  const filteredMedicines = medicines.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.genericName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleUpdateStock = (id: string, amount: number) => {
    const med = medicines.find(m => m.id === id)
    if (med) {
      updateMedicineStock(id, Math.max(0, med.stock + amount))
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar role="pharmacy" />
      <DashboardHeader role="pharmacy" />
      
      <main className="lg:pl-64">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Manajemen Stok</h1>
              <p className="text-muted-foreground">
                Pantau dan perbarui ketersediaan obat di apotek
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Sinkronisasi
              </Button>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Stok
              </Button>
            </div>
          </div>

          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <ClipboardList className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Item</p>
                    <h3 className="text-2xl font-bold">{medicines.length}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Stok Menipis</p>
                    <h3 className="text-2xl font-bold">{lowStockItems.length}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <ArrowUpRight className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Update Hari Ini</p>
                    <h3 className="text-2xl font-bold">12</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari obat..."
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
                  <TableHead>Nama Obat</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Stok Saat Ini</TableHead>
                  <TableHead>Satuan</TableHead>
                  <TableHead className="text-right">Aksi Stok</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMedicines.map((med) => (
                  <TableRow key={med.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{med.name}</p>
                        <p className="text-xs text-muted-foreground">{med.genericName}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{med.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`font-bold ${med.stock < 20 ? 'text-destructive' : 'text-foreground'}`}>
                        {med.stock}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{med.unit}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleUpdateStock(med.id, -10)}
                        >
                          -10
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleUpdateStock(med.id, 10)}
                        >
                          +10
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleUpdateStock(med.id, 50)}
                        >
                          +50
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
