'use client'

import { useState } from 'react'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { useAuthStore } from '@/lib/store'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { User, Lock, Bell, Shield } from 'lucide-react'

export default function PatientSettingsPage() {
  const { user, updatePassword } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSaveProfile = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast.success('Profil berhasil diperbarui')
    }, 1000)
  }

  const handleSavePassword = () => {
    if (!user) return
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Mohon isi semua bidang password')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Konfirmasi password tidak cocok!')
      return
    }
    setIsLoading(true)
    setTimeout(() => {
      updatePassword(user.id, newPassword)
      setIsLoading(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      toast.success('Kata sandi berhasil diubah')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar role="patient" />
      <DashboardHeader role="patient" />
      
      <main className="lg:pl-64">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Pengaturan</h1>
            <p className="text-muted-foreground">
              Kelola preferensi akun dan pengaturan profil Anda
            </p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="bg-muted">
              <TabsTrigger value="profile" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profil</span>
              </TabsTrigger>
              <TabsTrigger value="account" className="gap-2">
                <Lock className="h-4 w-4" />
                <span className="hidden sm:inline">Keamanan</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifikasi</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Profil</CardTitle>
                  <CardDescription>
                    Perbarui informasi identitas dan kontak Anda.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                        {user?.name?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" size="sm" className="mb-2">Ubah Foto</Button>
                      <p className="text-xs text-muted-foreground">
                        JPG, GIF atau PNG maksimal 2MB.
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama Lengkap</Label>
                      <Input id="name" defaultValue={user?.name || ''} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue={user?.email || ''} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Nomor Telepon</Label>
                      <Input id="phone" type="tel" defaultValue="+62 812-3456-7890" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob">Tanggal Lahir</Label>
                      <Input id="dob" type="date" defaultValue="1990-05-15" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="address">Alamat Lengkap</Label>
                      <Input id="address" defaultValue="Jl. Sudirman No. 123, Jakarta Selatan" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Button onClick={handleSaveProfile} disabled={isLoading}>
                    {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Medis Dasar</CardTitle>
                  <CardDescription>
                    Informasi medis ini penting untuk dokter dalam memberikan diagnosis.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="blood">Golongan Darah</Label>
                      <Input id="blood" defaultValue="O+" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Berat Badan (kg)</Label>
                      <Input id="weight" type="number" defaultValue="65" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="allergies">Alergi Obat/Makanan</Label>
                      <Input id="allergies" defaultValue="Penisilin" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Button variant="outline" onClick={handleSaveProfile} disabled={isLoading}>
                    Simpan Data Medis
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Ubah Kata Sandi</CardTitle>
                  <CardDescription>
                    Pastikan akun Anda menggunakan kata sandi yang kuat dan aman.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 max-w-md">
                    <Label htmlFor="current">Kata Sandi Saat Ini</Label>
                    <Input id="current" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                  </div>
                  <div className="space-y-2 max-w-md">
                    <Label htmlFor="new">Kata Sandi Baru</Label>
                    <Input id="new" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  </div>
                  <div className="space-y-2 max-w-md">
                    <Label htmlFor="confirm">Konfirmasi Kata Sandi Baru</Label>
                    <Input id="confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Button onClick={handleSavePassword} disabled={isLoading}>
                    {isLoading ? 'Mengubah...' : 'Ubah Kata Sandi'}
                  </Button>
                </CardFooter>
              </Card>

              <Card className="mt-6 border-destructive/20 bg-destructive/5">
                <CardHeader>
                  <CardTitle className="text-destructive flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Hapus Akun
                  </CardTitle>
                  <CardDescription>
                    Menghapus akun secara permanen. Tindakan ini tidak dapat dibatalkan.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="destructive">Hapus Akun Saya</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Preferensi Notifikasi</CardTitle>
                  <CardDescription>
                    Pilih pemberitahuan apa yang ingin Anda terima.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Email Notifikasi</h3>
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="email-appointments" className="flex flex-col space-y-1">
                        <span>Pengingat Konsultasi</span>
                        <span className="font-normal text-xs text-muted-foreground">Terima email 1 jam sebelum jadwal konsultasi</span>
                      </Label>
                      <Switch id="email-appointments" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="email-orders" className="flex flex-col space-y-1">
                        <span>Status Pesanan Obat</span>
                        <span className="font-normal text-xs text-muted-foreground">Pemberitahuan saat pesanan dikirim</span>
                      </Label>
                      <Switch id="email-orders" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="email-promos" className="flex flex-col space-y-1">
                        <span>Promo dan Penawaran</span>
                        <span className="font-normal text-xs text-muted-foreground">Info layanan baru dan diskon khusus</span>
                      </Label>
                      <Switch id="email-promos" />
                    </div>
                  </div>

                  <div className="space-y-4 border-t pt-4">
                    <h3 className="text-sm font-medium">Push Notifikasi (Aplikasi)</h3>
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="push-chat" className="flex flex-col space-y-1">
                        <span>Pesan Dokter</span>
                        <span className="font-normal text-xs text-muted-foreground">Notifikasi pesan baru dari dokter</span>
                      </Label>
                      <Switch id="push-chat" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="push-system" className="flex flex-col space-y-1">
                        <span>Pembaruan Sistem</span>
                        <span className="font-normal text-xs text-muted-foreground">Pemberitahuan pemeliharaan sistem</span>
                      </Label>
                      <Switch id="push-system" defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
