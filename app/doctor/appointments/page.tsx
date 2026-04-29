'use client'

import { useState, useEffect } from 'react'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Calendar,
  Clock,
  Video,
  Building,
  MessageSquare,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Phone,
  Stethoscope,
} from 'lucide-react'
import { mockAppointments } from '@/lib/mock-data'
import { useAppStore, useAuthStore } from '@/lib/store'

export default function DoctorAppointmentsPage() {
  const { user } = useAuthStore()
  const { updateAppointmentStatus, getAppointmentsByDoctor, getDoctors, refreshData } = useAppStore()
  const [activeTab, setActiveTab] = useState('pending')
  const [selectedAppointment, setSelectedAppointment] = useState<typeof mockAppointments[0] | null>(null)
  const [diagnosisDialogOpen, setDiagnosisDialogOpen] = useState(false)
  const [diagnosis, setDiagnosis] = useState('')
  const [prescription, setPrescription] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (user?.id) {
      refreshData(user.id, 'doctor')
    }
  }, [user?.id, refreshData])

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

  // Get current logged in doctor's profile
  const doctor = getDoctors().find(d => d.userId === user?.id)
  
  // Ambil data appointments khusus untuk dokter yang sedang login
  // Fallback ke mock data milik doc-1 jika tidak ada doctor yang login (sebagai demo fallback)
  const doctorId = doctor ? doctor.id : 'doc-1'
  const allAppointments = getAppointmentsByDoctor(doctorId)

  const filteredAppointments = allAppointments.filter((apt) => {
    if (activeTab === 'all') return true
    return apt.status === activeTab
  })

  const handleAccept = (id: string) => {
    updateAppointmentStatus(id, 'confirmed')
  }

  const handleReject = (id: string) => {
    updateAppointmentStatus(id, 'cancelled')
  }

  const handleComplete = (apt: typeof mockAppointments[0]) => {
    setSelectedAppointment(apt)
    setDiagnosisDialogOpen(true)
  }

  const submitDiagnosis = () => {
    if (selectedAppointment) {
      updateAppointmentStatus(selectedAppointment.id, 'completed', diagnosis, prescription)
      setDiagnosisDialogOpen(false)
      setDiagnosis('')
      setPrescription('')
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar role="doctor" />
      <DashboardHeader role="doctor" />
      
      <main className="lg:pl-64">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Kelola Konsultasi</h1>
            <p className="text-muted-foreground">
              Terima, kelola, dan selesaikan konsultasi pasien Anda
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="pending">
                Menunggu
                <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-700">
                  {allAppointments.filter((a) => a.status === 'pending').length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="confirmed">Dikonfirmasi</TabsTrigger>
              <TabsTrigger value="completed">Selesai</TabsTrigger>
              <TabsTrigger value="cancelled">Dibatalkan</TabsTrigger>
              <TabsTrigger value="all">Semua</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((apt) => (
                  <Card key={apt.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-14 w-14">
                            <AvatarFallback className="bg-accent/10 text-lg text-accent">
                              {getInitials(apt.patient.user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-semibold text-foreground">
                                {apt.patient.user.name}
                              </h3>
                              <Badge variant="secondary" className={getStatusColor(apt.status)}>
                                {getStatusLabel(apt.status)}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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
                                    Offline
                                  </>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-3 lg:grid-cols-2">
                          <div className="rounded-lg bg-muted/50 p-3">
                            <div className="mb-1 flex items-center gap-2 text-sm font-medium text-foreground">
                              <User className="h-4 w-4" />
                              Info Pasien
                            </div>
                            <div className="space-y-1 text-xs text-muted-foreground">
                              <p>Gender: {apt.patient.gender === 'male' ? 'Laki-laki' : 'Perempuan'}</p>
                              <p>Golongan Darah: {apt.patient.bloodType || '-'}</p>
                              <p>Alergi: {apt.patient.allergies?.join(', ') || 'Tidak ada'}</p>
                            </div>
                          </div>
                          <div className="rounded-lg bg-muted/50 p-3">
                            <div className="mb-1 flex items-center gap-2 text-sm font-medium text-foreground">
                              <Stethoscope className="h-4 w-4" />
                              Keluhan
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {apt.complaint || 'Tidak ada keluhan yang disampaikan'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-end gap-2 border-t border-border pt-4">
                        {apt.status === 'pending' && (
                          <>
                            <Button variant="outline" onClick={() => handleReject(apt.id)}>
                              <XCircle className="mr-1 h-4 w-4" />
                              Tolak
                            </Button>
                            <Button onClick={() => handleAccept(apt.id)}>
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Terima
                            </Button>
                          </>
                        )}
                        {apt.status === 'confirmed' && (
                          <>
                            <Button variant="outline">
                              <MessageSquare className="mr-1 h-4 w-4" />
                              Chat
                            </Button>
                            {apt.type === 'online' && (
                              <Button variant="outline">
                                <Video className="mr-1 h-4 w-4" />
                                Video Call
                              </Button>
                            )}
                            <Button onClick={() => handleComplete(apt)}>
                              <FileText className="mr-1 h-4 w-4" />
                              Input Diagnosa
                            </Button>
                          </>
                        )}
                        {apt.status === 'completed' && apt.diagnosis && (
                          <div className="w-full rounded-lg bg-blue-50 p-3">
                            <p className="text-sm font-medium text-blue-900">Diagnosis:</p>
                            <p className="text-sm text-blue-700">{apt.diagnosis}</p>
                            {apt.notes && (
                              <>
                                <p className="mt-2 text-sm font-medium text-blue-900">Resep/Catatan:</p>
                                <p className="text-sm text-blue-700">{apt.notes}</p>
                              </>
                            )}
                          </div>
                        )}
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
                  <p className="text-muted-foreground">
                    Belum ada konsultasi dalam kategori ini
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Dialog open={diagnosisDialogOpen} onOpenChange={setDiagnosisDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Input Diagnosa dan Resep</DialogTitle>
            <DialogDescription>
              Masukkan hasil diagnosa dan resep untuk pasien {selectedAppointment?.patient.user.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="diagnosis">Diagnosa</FieldLabel>
                <Textarea
                  id="diagnosis"
                  placeholder="Tuliskan hasil diagnosa..."
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  rows={3}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="prescription">Resep Obat</FieldLabel>
                <Textarea
                  id="prescription"
                  placeholder="Tuliskan resep obat..."
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  rows={4}
                />
              </Field>
            </FieldGroup>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDiagnosisDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={submitDiagnosis} disabled={!diagnosis.trim()}>
                Simpan dan Selesaikan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
