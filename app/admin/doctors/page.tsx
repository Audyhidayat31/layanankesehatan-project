'use client'

import { useState } from 'react'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
  Plus,
  Edit,
  Trash2,
  Stethoscope,
  Star,
  CheckCircle,
  ShieldCheck,
  Building,
  Loader2,
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'

export default function AdminDoctorsPage() {
  const { doctors, fetchDoctors, createDoctor } = useAppStore()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<any>(null)

  useEffect(() => {
    fetchDoctors()
  }, [fetchDoctors])

  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    hospital: '',
    experience: '',
    price: '',
    isVerified: false,
  })

  const filteredDoctors = doctors.filter((doctor) => {
    return (
      doctor.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.hospital.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const handleEdit = (doctor: any) => {
    setEditingDoctor(doctor)
    setFormData({
      name: doctor.user.name,
      specialization: doctor.specialization,
      hospital: doctor.hospital,
      experience: doctor.experience.toString(),
      price: doctor.price.toString(),
      isVerified: doctor.isVerified,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data dokter ini?')) {
      // Implement delete API call here
      toast({
        title: "Info",
        description: "Fitur hapus sedang dalam pengembangan",
      })
    }
  }

  const toggleVerification = async (id: string) => {
    // Implement verification toggle API call here if needed
    // For now, let's just toast
    toast({
      title: "Info",
      description: "Fitur toggle verifikasi sedang dalam pengembangan",
    })
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.specialization || !formData.hospital) {
      toast({
        title: "Error",
        description: "Mohon lengkapi data wajib (Nama, Spesialisasi, RS)",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    if (editingDoctor) {
      // Implement update doctor API call here
      toast({
        title: "Info",
        description: "Fitur edit sedang dalam pengembangan",
      })
    } else {
      const email = `${formData.name.toLowerCase().replace(/\s+/g, '.')}@healthservices.id`
      const res = await createDoctor({
        ...formData,
        email,
        password: 'demo123',
        experience: Number(formData.experience),
        price: Number(formData.price),
      })

      if (res.success) {
        toast({
          title: "Berhasil",
          description: "Akun dokter berhasil dibuat",
        })
        setIsDialogOpen(false)
        setFormData({
          name: '',
          specialization: '',
          hospital: '',
          experience: '',
          price: '',
          isVerified: false,
        })
      } else {
        toast({
          title: "Gagal",
          description: res.error,
          variant: "destructive"
        })
      }
    }
    setIsSubmitting(false)
    setEditingDoctor(null)
  }

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
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar role="admin" />
      <DashboardHeader role="admin" />
      
      <main className="lg:pl-64">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Manajemen Dokter</h1>
              <p className="text-muted-foreground">
                Kelola data dokter, verifikasi, dan tarif layanan
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open)
              if (!open) setEditingDoctor(null)
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Dokter
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingDoctor ? 'Edit Data Dokter' : 'Tambah Dokter Baru'}</DialogTitle>
                  <DialogDescription>
                    Lengkapi informasi profil dokter di bawah ini.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nama Lengkap</label>
                    <Input 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Contoh: dr. Ahmad Salim" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Spesialisasi</label>
                      <Input 
                        value={formData.specialization} 
                        onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                        placeholder="Spesialis Anak" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Pengalaman (Thn)</label>
                      <Input 
                        type="number"
                        value={formData.experience} 
                        onChange={(e) => setFormData({...formData, experience: e.target.value})}
                        placeholder="5" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Rumah Sakit / Klinik</label>
                    <Input 
                      value={formData.hospital} 
                      onChange={(e) => setFormData({...formData, hospital: e.target.value})}
                      placeholder="RS Medika Jakarta" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tarif Konsultasi (Rp)</label>
                    <Input 
                      type="number"
                      value={formData.price} 
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="150000" 
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
                      Verifikasi Akun Dokter
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>Batal</Button>
                  <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {editingDoctor ? 'Simpan Perubahan' : 'Tambah Dokter'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari dokter, spesialisasi, atau rumah sakit..."
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
                  <TableHead>Dokter</TableHead>
                  <TableHead>Spesialisasi</TableHead>
                  <TableHead>Lokasi Praktik</TableHead>
                  <TableHead>Tarif</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map((doctor) => (
                    <TableRow key={doctor.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">
                              {getInitials(doctor.user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-1">
                              <p className="font-medium text-foreground">{doctor.user.name}</p>
                              {doctor.isVerified && <CheckCircle className="h-3 w-3 text-primary" />}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>{doctor.rating} ({doctor.reviewCount} ulasan)</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-normal">
                          {doctor.specialization}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Building className="h-3 w-3" />
                          {doctor.hospital}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatPrice(doctor.price)}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={doctor.isVerified ? "text-primary hover:text-primary" : "text-muted-foreground"}
                          onClick={() => toggleVerification(doctor.id)}
                        >
                          <ShieldCheck className={`mr-1 h-4 w-4 ${doctor.isVerified ? "fill-primary/20" : ""}`} />
                          {doctor.isVerified ? "Terverifikasi" : "Belum Verif"}
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(doctor)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(doctor.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      Tidak ada data dokter yang ditemukan.
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
