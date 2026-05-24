'use client'

import Link from 'next/link'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import {
  Calendar,
  Users,
  MessageSquare,
  DollarSign,
  Clock,
  ArrowRight,
  Video,
  Building,
  CheckCircle,
  XCircle,
  Star,
  TrendingUp,
} from 'lucide-react'
import { useAuthStore, useAppStore } from '@/lib/store'
import { useState, useEffect } from 'react'

export default function DoctorDashboardPage() {
  const { user } = useAuthStore()
  const { appointments, getDoctors, refreshData, chatMessages } = useAppStore()
  const [isOnline, setIsOnline] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [doctorProfile, setDoctorProfile] = useState<any>(null)
  
  useEffect(() => {
    setMounted(true)
    if (user?.id) {
      refreshData(user.id, 'doctor')
      
      const fromStore = getDoctors().find(d => d.userId === user.id)
      if (fromStore) {
        setDoctorProfile(fromStore)
      } else {
        fetch(`/api/doctor-profile?userId=${user.id}`)
          .then(res => res.ok ? res.json() : null)
          .then(json => {
            if (json?.doctorProfile) {
              setDoctorProfile(json.doctorProfile)
            }
          })
          .catch(console.error)
      }
      
      // Auto refresh data every 5 seconds for "real-time" experience
      const interval = setInterval(() => {
        refreshData(user.id, 'doctor')
      }, 5000)
      
      return () => clearInterval(interval)
    }
  }, [user?.id, refreshData, getDoctors])

  const doctor = doctorProfile || getDoctors().find((d) => d.user.email === user?.email) || {
    id: `doc-${user?.id}`,
    userId: user?.id || '',
    user: {
      id: user?.id || '',
      name: user?.name || 'Dokter',
      email: user?.email || '',
      role: 'doctor',
    },
    specialization: 'Dokter',
    hospital: 'HealthServices',
    experience: 0,
    rating: 5.0,
    reviewCount: 0,
    price: 0,
    bio: '',
    education: [],
    availableSlots: [],
    isVerified: true,
    isOnline: true,
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'completed':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Menunggu',
      confirmed: 'Dikonfirmasi',
      completed: 'Selesai',
    }
    return labels[status] || status
  }

  const doctorAppointments = appointments.filter(a => a.doctorId === doctor.id)
  
  const todayAppointments = doctorAppointments.filter(
    (apt) => apt.status === 'confirmed' || apt.status === 'pending'
  )

  const unreadMessages = chatMessages.filter(
    (msg) => msg.receiverId === user?.id && !msg.isRead
  ).length

  const stats = [
    {
      label: 'Konsultasi Hari Ini',
      value: todayAppointments.length,
      icon: Calendar,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Total Pasien',
      value: 156,
      icon: Users,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      label: 'Pesan Baru',
      value: unreadMessages,
      icon: MessageSquare,
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/10',
    },
    {
      label: 'Pendapatan Bulan Ini',
      value: formatPrice(12500000),
      icon: DollarSign,
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/10',
      isPrice: true,
    },
  ]

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar role="doctor" />
      <DashboardHeader role="doctor" />
      
      <main className="lg:pl-64">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Selamat datang, {doctor.user.name}!
              </h1>
              <p className="text-muted-foreground">
                {doctor.specialization} - {doctor.hospital}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Switch
                  checked={isOnline}
                  onCheckedChange={setIsOnline}
                />
                <Badge variant="secondary" className={isOnline ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                  {isOnline ? 'Online' : 'Offline'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="mb-8 rounded-xl border border-border bg-card p-6">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-xl text-primary">
                    {getInitials(doctor.user.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold text-foreground">{doctor.user.name}</h2>
                    {doctor.isVerified && <CheckCircle className="h-5 w-5 text-primary" />}
                  </div>
                  <p className="text-primary">{doctor.specialization}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xl font-bold text-foreground">{doctor.rating}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{doctor.reviewCount} ulasan</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-foreground">{doctor.experience}</p>
                  <p className="text-xs text-muted-foreground">Tahun pengalaman</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-primary">{formatPrice(doctor.price)}</p>
                  <p className="text-xs text-muted-foreground">Per konsultasi</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className={`font-bold text-foreground ${stat.isPrice ? 'text-lg' : 'text-2xl'}`}>
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Jadwal Hari Ini
                </CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/doctor/appointments">
                    Lihat Semua <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {todayAppointments.length > 0 ? (
                  todayAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="flex items-center gap-4 rounded-lg border border-border p-4"
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-accent/10 text-accent">
                          {getInitials(apt.patient.user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-foreground">
                            {apt.patient.user.name}
                          </h4>
                          <Badge variant="secondary" className={getStatusColor(apt.status)}>
                            {getStatusLabel(apt.status)}
                          </Badge>
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {apt.time}
                          </span>
                          <span className="flex items-center gap-1">
                            {apt.type === 'online' ? (
                              <>
                                <Video className="h-3 w-3" />
                                Online
                              </>
                            ) : (
                              <>
                                <Building className="h-3 w-3" />
                                Offline
                              </>
                            )}
                          </span>
                        </div>
                        {apt.complaint && (
                          <p className="mt-1 text-xs text-muted-foreground truncate">
                            Keluhan: {apt.complaint}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {apt.status === 'pending' && (
                          <>
                            <Button size="sm" variant="outline">
                              <XCircle className="mr-1 h-4 w-4" />
                              Tolak
                            </Button>
                            <Button size="sm">
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Terima
                            </Button>
                          </>
                        )}
                        {apt.status === 'confirmed' && apt.type === 'online' && (
                          <Button size="sm">
                            <Video className="mr-1 h-4 w-4" />
                            Mulai
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    <Calendar className="mx-auto mb-2 h-8 w-8 opacity-50" />
                    <p>Tidak ada jadwal hari ini</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-chart-3" />
                  Statistik Mingguan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg bg-muted p-4">
                    <span className="text-muted-foreground">Konsultasi Selesai</span>
                    <span className="text-xl font-bold text-foreground">24</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-muted p-4">
                    <span className="text-muted-foreground">Pasien Baru</span>
                    <span className="text-xl font-bold text-foreground">8</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-muted p-4">
                    <span className="text-muted-foreground">Rating Rata-rata</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xl font-bold text-foreground">4.9</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-muted p-4">
                    <span className="text-muted-foreground">Pendapatan</span>
                    <span className="text-xl font-bold text-primary">{formatPrice(3750000)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
