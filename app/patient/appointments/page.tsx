'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Calendar,
  Clock,
  Video,
  Building,
  MessageSquare,
  FileText,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react'
import { mockAppointments } from '@/lib/mock-data'

export default function PatientAppointmentsPage() {
  const [activeTab, setActiveTab] = useState('all')

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
      .filter((n) => !n.startsWith('Dr'))
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
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Menunggu Konfirmasi',
      confirmed: 'Dikonfirmasi',
      completed: 'Selesai',
      cancelled: 'Dibatalkan',
    }
    return labels[status] || status
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />
      case 'pending':
        return <AlertCircle className="h-4 w-4" />
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      case 'cancelled':
        return <XCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const filteredAppointments = mockAppointments.filter((apt) => {
    if (activeTab === 'all') return true
    if (activeTab === 'upcoming') return apt.status === 'confirmed' || apt.status === 'pending'
    if (activeTab === 'completed') return apt.status === 'completed'
    if (activeTab === 'cancelled') return apt.status === 'cancelled'
    return true
  })

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar role="patient" />
      <DashboardHeader role="patient" />
      
      <main className="lg:pl-64">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Konsultasi Saya</h1>
              <p className="text-muted-foreground">
                Kelola semua jadwal konsultasi Anda
              </p>
            </div>
            <Button asChild>
              <Link href="/doctors">
                <Calendar className="mr-2 h-4 w-4" />
                Buat Janji Baru
              </Link>
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">Semua</TabsTrigger>
              <TabsTrigger value="upcoming">Mendatang</TabsTrigger>
              <TabsTrigger value="completed">Selesai</TabsTrigger>
              <TabsTrigger value="cancelled">Dibatalkan</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((apt) => (
                  <Card key={apt.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-14 w-14">
                            <AvatarFallback className="bg-primary/10 text-lg text-primary">
                              {getInitials(apt.doctor.user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="mb-1 flex flex-wrap items-center gap-2">
                              <h3 className="font-semibold text-foreground">
                                {apt.doctor.user.name}
                              </h3>
                              {apt.doctor.isVerified && (
                                <CheckCircle className="h-4 w-4 text-primary" />
                              )}
                              <Badge variant="secondary" className={getStatusColor(apt.status)}>
                                {getStatusIcon(apt.status)}
                                <span className="ml-1">{getStatusLabel(apt.status)}</span>
                              </Badge>
                            </div>
                            <p className="text-sm text-primary">{apt.doctor.specialization}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {apt.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {apt.time}
                              </span>
                              <span className="flex items-center gap-1">
                                {apt.type === 'online' ? (
                                  <>
                                    <Video className="h-4 w-4" />
                                    Online
                                  </>
                                ) : (
                                  <>
                                    <Building className="h-4 w-4" />
                                    {apt.doctor.hospital}
                                  </>
                                )}
                              </span>
                            </div>
                            {apt.complaint && (
                              <p className="mt-2 text-sm text-muted-foreground">
                                <span className="font-medium">Keluhan:</span> {apt.complaint}
                              </p>
                            )}
                            {apt.diagnosis && (
                              <p className="mt-1 text-sm text-muted-foreground">
                                <span className="font-medium">Diagnosis:</span> {apt.diagnosis}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 md:items-end">
                          <p className="text-lg font-semibold text-primary">
                            {formatPrice(apt.doctor.price)}
                          </p>
                          <div className="flex gap-2">
                            {apt.status === 'confirmed' && apt.type === 'online' && (
                              <Button size="sm">
                                <Video className="mr-1 h-4 w-4" />
                                Mulai Konsultasi
                              </Button>
                            )}
                            {apt.status === 'confirmed' && (
                              <Button variant="outline" size="sm">
                                <MessageSquare className="mr-1 h-4 w-4" />
                                Chat
                              </Button>
                            )}
                            {apt.status === 'completed' && (
                              <>
                                <Button variant="outline" size="sm">
                                  <FileText className="mr-1 h-4 w-4" />
                                  Lihat Resep
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Star className="mr-1 h-4 w-4" />
                                  Beri Ulasan
                                </Button>
                              </>
                            )}
                            {apt.status === 'pending' && (
                              <Button variant="destructive" size="sm">
                                <XCircle className="mr-1 h-4 w-4" />
                                Batalkan
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Calendar className="mb-4 h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mb-2 text-lg font-medium text-foreground">
                    Tidak ada konsultasi
                  </h3>
                  <p className="mb-4 text-muted-foreground">
                    Anda belum memiliki riwayat konsultasi dalam kategori ini
                  </p>
                  <Button asChild>
                    <Link href="/doctors">Cari Dokter</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
