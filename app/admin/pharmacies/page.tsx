'use client'

import { useState } from 'react'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
  Edit,
  Pill,
  MapPin,
  Phone,
  Clock,
  CheckCircle,
  Star,
  Building,
} from 'lucide-react'

const initialPharmacies = [
  {
    id: 'ph-1',
    name: 'Apotek Sehat Jaya',
    address: 'Jl. Sudirman No. 123, Jakarta Selatan',
    city: 'Jakarta Selatan',
    phone: '021-5551234',
    operatingHours: '08:00 - 22:00',
    isVerified: true,
    rating: 4.8,
    reviewCount: 120,
    isOpen: true,
  }
]

export default function AdminPharmaciesPage() {
  const [pharmacies, setPharmacies] = useState(initialPharmacies)
  const [searchQuery, setSearchQuery] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPharmacy, setEditingPharmacy] = useState<any>(null)

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    phone: '',
    operatingHours: '',
    isVerified: false,
  })

  const filteredPharmacies = pharmacies.filter((pharmacy) => {
    return (
      pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pharmacy.city.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const handleEdit = (pharmacy: any) => {
    setEditingPharmacy(pharmacy)
    setFormData({
      name: pharmacy.name,
      address: pharmacy.address,
      city: pharmacy.city,
      phone: pharmacy.phone,
      operatingHours: pharmacy.operatingHours,
      isVerified: pharmacy.isVerified,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    // Apotek deletion is disabled
  }

  const handleSubmit = () => {
    if (editingPharmacy) {
      setPharmacies(
        pharmacies.map((p) =>
          p.id === editingPharmacy.id ? { ...p, ...formData } : p
        )
      )
    } else {
      const newPharmacy = {
        id: `ph-${Date.now()}`,
        ...formData,
        rating: 0,
        reviewCount: 0,
        isOpen: true,
      }
      setPharmacies([...pharmacies, newPharmacy])
    }
    setIsDialogOpen(false)
    setEditingPharmacy(null)
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar role="admin" />
      <DashboardHeader role="admin" />
      
      <main className="lg:pl-64">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Manajemen Apotek</h1>
              <p className="text-muted-foreground">
                Kelola data mitra apotek dan status verifikasi
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open)
              if (!open) setEditingPharmacy(null)
            }}>
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Data Apotek</DialogTitle>
                  <DialogDescription>
                    Lengkapi informasi mitra apotek di bawah ini.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nama Apotek</label>
                    <Input 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Contoh: Apotek Sehat Jaya" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Alamat Lengkap</label>
                    <Input 
                      value={formData.address} 
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="Jl. Sudirman No. 123..." 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Kota</label>
                      <Input 
                        value={formData.city} 
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        placeholder="Jakarta Selatan" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Telepon</label>
                      <Input 
                        value={formData.phone} 
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="021-xxxxxx" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Jam Operasional</label>
                    <Input 
                      value={formData.operatingHours} 
                      onChange={(e) => setFormData({...formData, operatingHours: e.target.value})}
                      placeholder="08:00 - 22:00 atau 24 Jam" 
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <input 
                      type="checkbox" 
                      id="verified" 
                      checked={formData.isVerified}
                      onChange={(e) => setFormData({...formData, isVerified: e.target.checked})}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="verified" className="text-sm font-medium leading-none">
                      Verifikasi Mitra Apotek
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
                  <Button onClick={handleSubmit}>Simpan Perubahan</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari apotek atau kota..."
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
                  <TableHead>Apotek</TableHead>
                  <TableHead>Alamat & Kontak</TableHead>
                  <TableHead>Jam Operasional</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPharmacies.length > 0 ? (
                  filteredPharmacies.map((pharmacy) => (
                    <TableRow key={pharmacy.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-700">
                            <Building className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1">
                              <p className="font-medium text-foreground">{pharmacy.name}</p>
                              {pharmacy.isVerified && <CheckCircle className="h-3 w-3 text-primary" />}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>{pharmacy.rating} ({pharmacy.reviewCount} ulasan)</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {pharmacy.address}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {pharmacy.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {pharmacy.operatingHours}
                        </div>
                      </TableCell>
                      <TableCell>
                        {pharmacy.isVerified ? (
                          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Terverifikasi</Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">Belum Verif</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(pharmacy)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      Tidak ada data apotek yang ditemukan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      </main>
    </div>
  )
}
