'use client'

import { useState, useEffect } from 'react'
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
import { useAuthStore, useAppStore } from '@/lib/store'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

export default function PatientAppointmentsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const { user } = useAuthStore()
  const { getAppointmentsByPatient, refreshData, updateAppointmentStatus, appointments, submitDoctorReview } = useAppStore()

  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [prescriptionDialogOpen, setPrescriptionDialogOpen] = useState(false)
  
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
 
  useEffect(() => {
    if (user?.id) {
      refreshData(user.id, 'patient')
      
      // Auto-refresh appointments every 5 seconds for a real-time experience
      const interval = setInterval(() => {
        refreshData(user.id, 'patient')
      }, 5000)
      
      return () => clearInterval(interval)
    }
  }, [user?.id, refreshData])

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

  // Ambil data appointments dari state store
  const patientId = user?.id === 'user-1' ? 'pat-1' : `pat-${user?.id}`
  const allAppointments = user ? getAppointmentsByPatient(patientId) : []

  const filteredAppointments = allAppointments.filter((apt) => {
    if (activeTab === 'all') return true
    if (activeTab === 'upcoming') return apt.status === 'confirmed' || apt.status === 'pending'
    if (activeTab === 'completed') return apt.status === 'completed'
    if (activeTab === 'cancelled') return apt.status === 'cancelled'
    return true
  })

  const handleCancel = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin membatalkan konsultasi ini?')) {
      await updateAppointmentStatus(id, 'cancelled')
      if (user?.id) refreshData(user.id, 'patient')
    }
  }

  const handleSubmitReview = async () => {
    if (!selectedAppointment?.doctor) return
    setSubmittingReview(true)
    try {
      await submitDoctorReview(selectedAppointment.doctor.id, reviewRating)
      toast.success('Ulasan Anda berhasil dikirim! Terima kasih atas masukan Anda.')
      setReviewDialogOpen(false)
    } catch (error) {
      console.error('Submit review error:', error)
      toast.error('Gagal mengirimkan ulasan.')
    } finally {
      setSubmittingReview(false)
    }
  }

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
                              <Button size="sm" asChild>
                                <Link href={`/patient/chat?doctorId=${apt.doctor.userId}`}>
                                  <Video className="mr-1 h-4 w-4" />
                                  Mulai Konsultasi
                                </Link>
                              </Button>
                            )}
                            {apt.status === 'confirmed' && (
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/patient/chat?doctorId=${apt.doctor.userId}`}>
                                  <MessageSquare className="mr-1 h-4 w-4" />
                                  Chat
                                </Link>
                              </Button>
                            )}
                            {apt.status === 'completed' && (
                              <>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    setSelectedAppointment(apt)
                                    setPrescriptionDialogOpen(true)
                                  }}
                                >
                                  <FileText className="mr-1 h-4 w-4" />
                                  Lihat Resep
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    setSelectedAppointment(apt)
                                    setReviewRating(5)
                                    setReviewComment('')
                                    setReviewDialogOpen(true)
                                  }}
                                >
                                  <Star className="mr-1 h-4 w-4" />
                                  Beri Ulasan
                                </Button>
                              </>
                            )}
                            {apt.status === 'pending' && (
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleCancel(apt.id)}
                              >
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

      {/* ════════════════════════════════════════════════════════════
          DIALOG LIHAT RESEP
      ════════════════════════════════════════════════════════════ */}
      <Dialog open={prescriptionDialogOpen} onOpenChange={setPrescriptionDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Resep & Catatan Dokter
            </DialogTitle>
            <DialogDescription>
              Detail resep obat dan catatan konsultasi dari dokter Anda.
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4 mt-2">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl border">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(selectedAppointment.doctor.user.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">
                    {selectedAppointment.doctor.user.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {selectedAppointment.doctor.specialization} • {selectedAppointment.doctor.hospital}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-muted-foreground font-medium">Tanggal Konsultasi</span>
                <p className="text-sm text-foreground flex items-center gap-1.5 font-medium">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {selectedAppointment.date} • {selectedAppointment.time} WIB
                </p>
              </div>

              <div className="space-y-1.5 border-t pt-3">
                <span className="text-xs text-muted-foreground font-medium">Hasil Diagnosa</span>
                <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-xl text-sm text-foreground min-h-[50px] leading-relaxed">
                  {selectedAppointment.diagnosis || 'Tidak ada diagnosa tertulis.'}
                </div>
              </div>

              <div className="space-y-1.5 border-t pt-3">
                <span className="text-xs text-muted-foreground font-medium">Resep Obat / Catatan Tambahan</span>
                <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl text-sm text-emerald-900 dark:text-emerald-300 min-h-[80px] font-mono leading-relaxed whitespace-pre-wrap">
                  {selectedAppointment.notes || 'Tidak ada resep obat tertulis.'}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button onClick={() => setPrescriptionDialogOpen(false)} className="w-full sm:w-auto">
                  Tutup
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ════════════════════════════════════════════════════════════
          DIALOG BERI ULASAN
      ════════════════════════════════════════════════════════════ */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              Beri Ulasan Dokter
            </DialogTitle>
            <DialogDescription>
              Bagikan pengalaman konsultasi Anda untuk membantu pasien lain.
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4 mt-2">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl border">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(selectedAppointment.doctor.user.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">
                    {selectedAppointment.doctor.user.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {selectedAppointment.doctor.specialization} • {selectedAppointment.doctor.hospital}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-center py-2">
                <label className="text-sm font-medium text-muted-foreground block">
                  Seberapa puas Anda dengan pelayanan dokter?
                </label>
                <div className="flex justify-center gap-1.5 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 hover:scale-110 transition-transform focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 transition-colors ${
                          star <= reviewRating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-muted/60 dark:text-muted-foreground/30'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="comment" className="text-xs text-muted-foreground font-medium">
                  Ulasan / Komentar Anda
                </label>
                <Textarea
                  id="comment"
                  placeholder="Ceritakan pengalaman konsultasi Anda (opsional)..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={4}
                  className="rounded-xl resize-none focus-visible:ring-primary/50"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setReviewDialogOpen(false)}
                  className="flex-1"
                  disabled={submittingReview}
                >
                  Batal
                </Button>
                <Button
                  onClick={handleSubmitReview}
                  className="flex-1"
                  disabled={submittingReview}
                >
                  {submittingReview ? 'Mengirim...' : 'Kirim Ulasan'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
