'use client'

import { useState, useEffect } from 'react'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  Users as UsersIcon,
  UserPlus,
  Filter,
  Shield,
  User,
  Stethoscope,
  Pill,
} from 'lucide-react'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'PATIENT',
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/users')
      const data = await res.json()
      if (data.success) {
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = selectedRole === 'all' || user.role === selectedRole
    return matchesSearch && matchesRole
  })

  const handleEdit = (user: any) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      try {
        const res = await fetch(`/api/users/${id}`, {
          method: 'DELETE',
        })
        const data = await res.json()
        if (data.success) {
          setUsers(users.filter((u) => u.id !== id))
        } else {
          alert(data.error || 'Gagal menghapus pengguna')
        }
      } catch (error) {
        console.error('Failed to delete user:', error)
        alert('Terjadi kesalahan saat menghapus pengguna')
      }
    }
  }

  const handleSubmit = async () => {
    try {
      if (editingUser) {
        const res = await fetch(`/api/users/${editingUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
        const data = await res.json()
        if (data.success) {
          setUsers(
            users.map((u) =>
              u.id === editingUser.id ? { ...u, ...data.user } : u
            )
          )
        } else {
          alert(data.error || 'Gagal mengupdate pengguna')
          return
        }
      } else {
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
        const data = await res.json()
        if (data.success) {
          setUsers([data.user, ...users])
        } else {
          alert(data.error || 'Gagal membuat pengguna')
          return
        }
      }
      setIsDialogOpen(false)
      setEditingUser(null)
      setFormData({ name: '', email: '', role: 'PATIENT' })
    } catch (error) {
      console.error('Submit user error:', error)
      alert('Terjadi kesalahan')
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100"><Shield className="mr-1 h-3 w-3" /> Admin</Badge>
      case 'DOCTOR':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100"><Stethoscope className="mr-1 h-3 w-3" /> Dokter</Badge>
      case 'PHARMACY':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100"><Pill className="mr-1 h-3 w-3" /> Apotek</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100"><User className="mr-1 h-3 w-3" /> Pasien</Badge>
    }
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
              <h1 className="text-2xl font-bold text-foreground">Manajemen Pengguna</h1>
              <p className="text-muted-foreground">
                Kelola semua akun pengguna di dalam platform
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open)
              if (!open) {
                setEditingUser(null)
                setFormData({ name: '', email: '', role: 'PATIENT' })
              }
            }}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Tambah Pengguna
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</DialogTitle>
                  <DialogDescription>
                    Isi informasi profil pengguna di bawah ini.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nama Lengkap</label>
                    <Input 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Masukkan nama lengkap" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input 
                      type="email"
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="email@contoh.com" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Peran (Role)</label>
                    <Select 
                      value={formData.role} 
                      onValueChange={(v) => setFormData({...formData, role: v})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih peran" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PATIENT">Pasien</SelectItem>
                        <SelectItem value="DOCTOR">Dokter</SelectItem>
                        <SelectItem value="PHARMACY">Apotek</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
                  <Button onClick={handleSubmit}>{editingUser ? 'Simpan Perubahan' : 'Tambah Pengguna'}</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="mb-6">
            <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari nama atau email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Semua Peran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Peran</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="DOCTOR">Dokter</SelectItem>
                  <SelectItem value="PHARMACY">Apotek</SelectItem>
                  <SelectItem value="PATIENT">Pasien</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pengguna</TableHead>
                  <TableHead>Peran</TableHead>
                  <TableHead>Terdaftar Pada</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      Memuat data...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-primary/10 text-xs text-primary font-bold">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getRoleBadge(user.role)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      Tidak ada pengguna yang ditemukan.
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
