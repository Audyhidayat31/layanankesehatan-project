'use client'

import { useState, useEffect } from 'react'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Lock, Bell, Camera, Stethoscope, Building, MapPin, DollarSign, Briefcase } from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import { toast } from 'sonner'

export default function DoctorSettingsPage() {
  const { user, updatePassword } = useAuthStore()
  const [doctorProfile, setDoctorProfile] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Form states
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [hospital, setHospital] = useState('')
  const [bio, setBio] = useState('')
  const [practiceAddress, setPracticeAddress] = useState('')
  const [experience, setExperience] = useState<number>(0)
  const [price, setPrice] = useState<number>(0)

  useEffect(() => {
    if (user?.id) {
      fetch(`/api/doctor-profile?userId=${user.id}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((json) => {
          if (json?.success && json.doctorProfile) {
            const dp = json.doctorProfile
            setDoctorProfile(dp)
            setName(dp.user?.name || user.name || '')
            setEmail(dp.user?.email || user.email || '')
            setPhone(dp.user?.phone || user.phone || '')
            setSpecialization(dp.specialization || '')
            setHospital(dp.hospital || '')
            setBio(dp.bio || '')
            setPracticeAddress(dp.practiceAddress || '')
            setExperience(dp.experience || 0)
            setPrice(dp.price || 0)
          }
        })
        .catch((err) => console.error('Gagal mengambil profil dokter:', err))
    }
  }, [user])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!doctorProfile) {
      toast.error('Profil dokter belum dimuat.')
      return
    }

    setIsSaving(true)
    try {
      const res = await fetch('/api/doctor-profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: doctorProfile.id,
          specialization,
          hospital,
          experience: Number(experience),
          price: Number(price),
          bio,
          practiceAddress,
        }),
      })

      if (res.ok) {
        const json = await res.json()
        if (json.success) {
          toast.success('Profil berhasil diperbarui!')
          setDoctorProfile(json.doctorProfile)
        } else {
          toast.error(json.error || 'Gagal memperbarui profil.')
        }
      } else {
        toast.error('Gagal memperbarui profil di server.')
      }
    } catch (error) {
      console.error('Update profile error:', error)
      toast.error('Terjadi kesalahan saat menyimpan data.')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    if (newPassword !== confirmPassword) {
      toast.error('Konfirmasi password tidak cocok!')
      return
    }
    setIsSaving(true)
    setTimeout(() => {
      updatePassword(user.id, newPassword)
      setIsSaving(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      toast.success('Password berhasil diperbarui!')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar role="doctor" />
      <DashboardHeader role="doctor" />
      
      <main className="lg:pl-64">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Pengaturan Akun</h1>
            <p className="text-muted-foreground">
              Kelola informasi profil, preferensi, dan keamanan akun Anda
            </p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="bg-card w-full justify-start border-b rounded-none h-auto p-0 flex flex-wrap">
              <TabsTrigger 
                value="profile" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none py-3 px-6"
              >
                <User className="w-4 h-4 mr-2" />
                Profil
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none py-3 px-6"
              >
                <Lock className="w-4 h-4 mr-2" />
                Keamanan
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none py-3 px-6"
              >
                <Bell className="w-4 h-4 mr-2" />
                Notifikasi
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Foto Profil</CardTitle>
                  <CardDescription>Perbarui foto profil yang akan ditampilkan kepada pasien.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="bg-primary/10 text-xl text-primary font-bold">
                      SW
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" className="gap-2">
                      <Camera className="h-4 w-4" />
                      Ubah Foto
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Format JPG, GIF atau PNG. Ukuran maksimal 2MB.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Informasi Personal & Praktik</CardTitle>
                  <CardDescription>Perbarui informasi dasar dan spesialisasi Anda.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Nama Lengkap beserta Gelar (Akun)</label>
                        <Input value={name} disabled className="bg-muted text-muted-foreground" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email (Akun)</label>
                        <Input type="email" value={email} disabled className="bg-muted text-muted-foreground" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Nomor Telepon (Akun)</label>
                        <Input type="tel" value={phone} disabled className="bg-muted text-muted-foreground" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Spesialisasi</label>
                        <div className="relative">
                          <Stethoscope className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input className="pl-10" value={specialization} onChange={(e) => setSpecialization(e.target.value)} required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Rumah Sakit Utama / Instansi</label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input className="pl-10" value={hospital} onChange={(e) => setHospital(e.target.value)} required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Pengalaman (Tahun)</label>
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input type="number" className="pl-10" value={experience} onChange={(e) => setExperience(Number(e.target.value))} required min={0} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Tarif Konsultasi (IDR)</label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input type="number" className="pl-10" value={price} onChange={(e) => setPrice(Number(e.target.value))} required min={0} />
                        </div>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium">Alamat Praktek Dokter (Konsultasi Offline)</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <textarea 
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent pl-10 pr-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            value={practiceAddress} 
                            onChange={(e) => setPracticeAddress(e.target.value)}
                            placeholder="Alamat lengkap lokasi praktek pertemuan fisik (offline)..."
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium">Deskripsi / Bio Singkat</label>
                        <textarea 
                          className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" disabled={isSaving}>
                        {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ubah Password</CardTitle>
                  <CardDescription>Pastikan akun Anda menggunakan password yang kuat.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordSave} className="space-y-4 max-w-md">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Password Saat Ini</label>
                      <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Password Baru</label>
                      <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={4} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Konfirmasi Password Baru</label>
                      <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={4} />
                    </div>
                    <Button type="submit" disabled={isSaving} className="mt-2">
                      {isSaving ? 'Menyimpan...' : 'Perbarui Password'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Preferensi Notifikasi</CardTitle>
                  <CardDescription>Pilih notifikasi apa saja yang ingin Anda terima.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">Email Notifikasi</h4>
                      <p className="text-sm text-muted-foreground">Terima notifikasi via email untuk jadwal baru.</p>
                    </div>
                    <div className="flex items-center h-5">
                      <input type="checkbox" className="h-4 w-4 rounded border-gray-300" defaultChecked />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">Pesan Masuk</h4>
                      <p className="text-sm text-muted-foreground">Notifikasi saat ada pesan baru dari pasien.</p>
                    </div>
                    <div className="flex items-center h-5">
                      <input type="checkbox" className="h-4 w-4 rounded border-gray-300" defaultChecked />
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving ? 'Menyimpan...' : 'Simpan Preferensi'}
                    </Button>
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
