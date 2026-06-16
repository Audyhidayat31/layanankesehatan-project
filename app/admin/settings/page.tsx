'use client'

import { useState } from 'react'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { useAuthStore } from '@/lib/store'
import { Bell, Lock, User, Globe, Save, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function AdminSettingsPage() {
  const { user, updatePassword } = useAuthStore()
  const { theme, setTheme } = useTheme()
  const [loading, setLoading] = useState(false)

  // Mock form state
  const [profile, setProfile] = useState({
    name: user?.name || 'Admin MedConnect',
    email: user?.email || 'admin@gmail.com',
  })

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    newUsers: true,
    systemUpdates: false,
  })

  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [maintenanceMode, setMaintenanceMode] = useState(false)

  const handleMaintenanceToggle = (checked: boolean) => {
    setMaintenanceMode(checked)
    if (checked) {
      alert('Mode pemeliharaan diaktifkan. Akses publik akan dibatasi.')
    } else {
      alert('Mode pemeliharaan dinonaktifkan. Sistem berjalan normal.')
    }
  }

  const handleSaveProfile = async () => {
    if (!user?.id) return
    setLoading(true)
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })
      const data = await res.json()
      if (data.success) {
        alert('Profil berhasil diperbarui')
        // Update local store state if needed (usually done by re-fetching or updating store)
        // For simplicity, we just notify success
      } else {
        alert(data.error || 'Gagal memperbarui profil')
      }
    } catch (error) {
      console.error('Update profile error:', error)
      alert('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSecurity = async () => {
    if (!user?.id) return
    
    // Validasi input
    if (!security.newPassword) {
      alert('Kata sandi baru tidak boleh kosong')
      return
    }
    if (security.newPassword !== security.confirmPassword) {
      alert('Konfirmasi kata sandi tidak cocok')
      return
    }

    setLoading(true)
    try {
      // 1. Update ke Database via API
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: security.newPassword }),
      })
      
      const data = await res.json()
      
      if (data.success) {
        // 2. Update Local State (Zustand) agar sinkron tanpa logout
        updatePassword(user.id, security.newPassword)
        
        alert('Kata Sandi berhasil diperbarui')
        setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        // Jika gagal (misal ID mock '1' tidak ada di DB)
        if (res.status === 404) {
          alert('Gagal: Pengguna tidak ditemukan di database. Pastikan Anda tidak sedang menggunakan akun Demo.')
        } else {
          alert(data.error || 'Gagal mengubah kata sandi')
        }
      }
    } catch (error) {
      console.error('Update password error:', error)
      alert('Terjadi kesalahan koneksi ke server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-modern">
      <DashboardSidebar role="admin" />
      <div className="flex-1 lg:pl-64 transition-all duration-300">
        <DashboardHeader role="admin" />
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mb-8 slide-up-fade">
            <h1 className="text-4xl font-extrabold tracking-tight text-gradient mb-2">Pengaturan Sistem</h1>
            <p className="text-muted-foreground text-lg">Kelola preferensi dan pengaturan sistem administrator Anda.</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-8 slide-up-fade" style={{ animationDelay: '0.1s' }}>
            <TabsList className="bg-background/80 backdrop-blur-md border shadow-md p-1 rounded-xl">
              <TabsTrigger value="profile" className="gap-2"><User className="h-4 w-4" /> Profil</TabsTrigger>
              <TabsTrigger value="security" className="gap-2"><Lock className="h-4 w-4" /> Keamanan</TabsTrigger>
              <TabsTrigger value="system" className="gap-2"><Globe className="h-4 w-4" /> Sistem</TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2"><Bell className="h-4 w-4" /> Notifikasi</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6 slide-up-fade" style={{ animationDelay: '0.2s' }}>
              <Card className="glass-card border-border/40 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-primary via-accent to-secondary"></div>
                <CardHeader>
                  <CardTitle className="text-2xl">Profil Administrator</CardTitle>
                  <CardDescription>Perbarui informasi publik dan detail kontak Anda.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input 
                      id="name" 
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      className="max-w-md focus-visible:ring-primary/50 transition-all duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Alamat Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      className="max-w-md focus-visible:ring-primary/50 transition-all duration-300"
                    />
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border/40 px-6 py-4">
                  <Button onClick={handleSaveProfile} disabled={loading} className="gap-2">
                    <Save className="h-4 w-4" /> {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-6 slide-up-fade" style={{ animationDelay: '0.2s' }}>
              <Card className="glass-card border-border/40 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-destructive via-red-500 to-orange-500"></div>
                <CardHeader>
                  <CardTitle className="text-2xl">Keamanan Akun</CardTitle>
                  <CardDescription>Perbarui kata sandi untuk mengamankan akun administrator Anda.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current">Kata Sandi Saat Ini</Label>
                    <Input 
                      id="current" 
                      type="password" 
                      value={security.currentPassword}
                      onChange={(e) => setSecurity({...security, currentPassword: e.target.value})}
                      className="max-w-md focus-visible:ring-primary/50 transition-all duration-300" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new">Kata Sandi Baru</Label>
                    <Input 
                      id="new" 
                      type="password" 
                      value={security.newPassword}
                      onChange={(e) => setSecurity({...security, newPassword: e.target.value})}
                      className="max-w-md focus-visible:ring-primary/50 transition-all duration-300" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm">Konfirmasi Kata Sandi Baru</Label>
                    <Input 
                      id="confirm" 
                      type="password" 
                      value={security.confirmPassword}
                      onChange={(e) => setSecurity({...security, confirmPassword: e.target.value})}
                      className="max-w-md focus-visible:ring-primary/50 transition-all duration-300" 
                    />
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border/40 px-6 py-4">
                  <Button onClick={handleSaveSecurity} disabled={loading} className="gap-2">
                    <Lock className="h-4 w-4" /> {loading ? 'Memperbarui...' : 'Perbarui Kata Sandi'}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="system" className="mt-6 slide-up-fade" style={{ animationDelay: '0.2s' }}>
              <Card className="glass-card border-border/40 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                <CardHeader>
                  <CardTitle className="text-2xl">Pengaturan Tampilan Sistem</CardTitle>
                  <CardDescription>Sesuaikan tampilan antarmuka dan tema panel administrasi.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-xl bg-card">
                    <div className="space-y-0.5">
                      <Label className="text-base">Mode Gelap (Dark Mode)</Label>
                      <p className="text-sm text-muted-foreground">Aktifkan tema gelap untuk kenyamanan mata.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4 text-muted-foreground" />
                      <Switch 
                        checked={theme === 'dark'} 
                        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} 
                      />
                      <Moon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-xl bg-card">
                    <div className="space-y-0.5">
                      <Label className="text-base">Mode Pemeliharaan (Maintenance)</Label>
                      <p className="text-sm text-muted-foreground">Batasi akses pengguna saat sistem sedang diperbaiki.</p>
                    </div>
                    <Switch 
                      checked={maintenanceMode}
                      onCheckedChange={handleMaintenanceToggle}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-6 slide-up-fade" style={{ animationDelay: '0.2s' }}>
              <Card className="glass-card border-border/40 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500"></div>
                <CardHeader>
                  <CardTitle className="text-2xl">Preferensi Notifikasi</CardTitle>
                  <CardDescription>Pilih jenis peringatan yang ingin Anda terima.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-xl bg-card">
                    <div className="space-y-0.5">
                      <Label className="text-base">Laporan Email</Label>
                      <p className="text-sm text-muted-foreground">Terima ringkasan transaksi & aktivitas setiap hari.</p>
                    </div>
                    <Switch 
                      checked={notifications.emailAlerts}
                      onCheckedChange={(c) => setNotifications({...notifications, emailAlerts: c})}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-xl bg-card">
                    <div className="space-y-0.5">
                      <Label className="text-base">Pendaftaran Pengguna Baru</Label>
                      <p className="text-sm text-muted-foreground">Notifikasi saat dokter atau apotek baru mendaftar.</p>
                    </div>
                    <Switch 
                      checked={notifications.newUsers}
                      onCheckedChange={(c) => setNotifications({...notifications, newUsers: c})}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-xl bg-card">
                    <div className="space-y-0.5">
                      <Label className="text-base">Pembaruan Sistem</Label>
                      <p className="text-sm text-muted-foreground">Dapatkan info rilis fitur terbaru platform.</p>
                    </div>
                    <Switch 
                      checked={notifications.systemUpdates}
                      onCheckedChange={(c) => setNotifications({...notifications, systemUpdates: c})}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        </main>
      </div>
    </div>
  )
}
