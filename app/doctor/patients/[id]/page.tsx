'use client'

import { use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowLeft, User, Phone, Mail, Calendar, FileText } from 'lucide-react'
import { useAuthStore, useAppStore } from '@/lib/store'
import { useEffect, useState } from 'react'

export default function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { user, registeredUsers } = useAuthStore()
  const { appointments, refreshData } = useAppStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (user?.id) {
      refreshData(user.id, 'doctor')
    }
  }, [user, refreshData])

  if (!mounted) return null

  // resolvedParams.id is likely the userId of the patient
  const patientUser = registeredUsers.find(u => u.id === resolvedParams.id)

  if (!patientUser) {
    return (
      <div className="min-h-screen bg-muted/30">
        <DashboardSidebar role="doctor" />
        <DashboardHeader role="doctor" />
        <main className="lg:pl-64">
          <div className="container mx-auto px-4 py-8 text-center">
            <h1 className="mb-2 text-2xl font-bold">Pasien tidak ditemukan</h1>
            <Button asChild>
              <Link href="/doctor/chat">Kembali ke Chat</Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  const patientAppointments = appointments.filter(a => a.patient.userId === patientUser.id)

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
      <DashboardSidebar role="doctor" />
      <DashboardHeader role="doctor" />
      
      <main className="lg:pl-64">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Halaman Chat
          </Button>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Avatar className="h-32 w-32 mx-auto mb-4 border-4 border-primary/20">
                    <AvatarImage src={patientUser.avatar} />
                    <AvatarFallback className="bg-primary/10 text-3xl font-semibold text-primary">
                      {getInitials(patientUser.name)}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl font-bold text-foreground mb-1">{patientUser.name}</h2>
                  <p className="text-muted-foreground mb-4">Pasien</p>
                  
                  <div className="space-y-3 text-left">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{patientUser.email}</span>
                    </div>
                    {patientUser.phone && (
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{patientUser.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>Bergabung: {new Date(patientUser.createdAt!).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Riwayat Konsultasi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {patientAppointments.length > 0 ? (
                    <div className="space-y-4">
                      {patientAppointments.map(apt => (
                        <div key={apt.id} className="p-4 border border-border rounded-lg flex items-center justify-between">
                          <div>
                            <div className="font-semibold mb-1">{apt.date} - {apt.time}</div>
                            <div className="text-sm text-muted-foreground">Tipe: {apt.type === 'online' ? 'Online' : 'Offline'} | Status: <span className="capitalize">{apt.status}</span></div>
                            {apt.complaint && <div className="text-sm mt-1">Keluhan: {apt.complaint}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Belum ada riwayat konsultasi.
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Rekam Medis Ringkas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    Belum ada rekam medis yang dicatat.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
