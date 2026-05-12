'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
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
  Send,
  X,
  CheckCheck,
  Loader2,
} from 'lucide-react'
import { mockAppointments } from '@/lib/mock-data'
import { useAppStore, useAuthStore } from '@/lib/store'

export default function DoctorAppointmentsPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const {
    updateAppointmentStatus,
    getAppointmentsByDoctor,
    getDoctors,
    refreshData,
    appointments,
    sendMessage,
    fetchMessages,
    getMessagesBetweenUsers,
    markMessagesAsRead,
    chatMessages,
  } = useAppStore()
  const [activeTab, setActiveTab] = useState('pending')
  const [selectedAppointment, setSelectedAppointment] = useState<typeof mockAppointments[0] | null>(null)
  const [diagnosisDialogOpen, setDiagnosisDialogOpen] = useState(false)
  const [diagnosis, setDiagnosis] = useState('')
  const [prescription, setPrescription] = useState('')
  const [mounted, setMounted] = useState(false)
  const [doctorProfileId, setDoctorProfileId] = useState<string | null>(null)

  // ─── Chat State ───────────────────────────────────────────────
  const [chatOpen, setChatOpen] = useState(false)
  const [chatPatientUserId, setChatPatientUserId] = useState<string | null>(null)
  const [chatPatientName, setChatPatientName] = useState<string>('')
  const [newMessage, setNewMessage] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  const chatScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    if (user?.id) {
      refreshData(user.id, 'doctor')

      const fromStore = getDoctors().find(d => d.userId === user.id)
      if (fromStore) {
        setDoctorProfileId(fromStore.id)
      } else {
        fetch(`/api/doctor-profile?userId=${user.id}`)
          .then(r => r.ok ? r.json() : null)
          .then(json => {
            if (json?.doctorProfile?.id) {
              setDoctorProfileId(json.doctorProfile.id)
            }
          })
          .catch(console.error)
      }
      
      const interval = setInterval(() => {
        refreshData(user.id, 'doctor')
      }, 5000)
      
      return () => clearInterval(interval)
    }
  }, [user?.id, refreshData, getDoctors])

  // ─── Poll messages saat chat terbuka ─────────────────────────
  useEffect(() => {
    if (!chatOpen || !chatPatientUserId || !user?.id) return
    fetchMessages(user.id, chatPatientUserId)
    const interval = setInterval(() => {
      fetchMessages(user.id, chatPatientUserId)
    }, 3000)
    return () => clearInterval(interval)
  }, [chatOpen, chatPatientUserId, user?.id, fetchMessages])

  // ─── Auto scroll chat ke bawah ───────────────────────────────
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight
    }
  }, [chatMessages, chatOpen])

  // ─── Mark messages as read saat chat terbuka ─────────────────
  useEffect(() => {
    if (chatOpen && chatPatientUserId && user?.id) {
      markMessagesAsRead(chatPatientUserId, user.id)
    }
  }, [chatOpen, chatPatientUserId, user?.id, chatMessages.length, markMessagesAsRead])

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

  const doctor = getDoctors().find(d => d.userId === user?.id)
  const resolvedDoctorId = doctor?.id || doctorProfileId

  const allAppointments = appointments.filter(apt => {
    if (!resolvedDoctorId && !user?.id) return false
    return (
      apt.doctorId === resolvedDoctorId ||
      apt.doctor?.userId === user?.id ||
      apt.doctor?.user?.id === user?.id
    )
  })

  const filteredAppointments = allAppointments.filter((apt) => {
    if (activeTab === 'all') return true
    return apt.status === activeTab
  })

  const handleAccept = async (id: string) => {
    await updateAppointmentStatus(id, 'confirmed')
    if (user?.id) refreshData(user.id, 'doctor')
  }

  const handleReject = async (id: string) => {
    await updateAppointmentStatus(id, 'cancelled')
    if (user?.id) refreshData(user.id, 'doctor')
  }

  const handleComplete = (apt: typeof mockAppointments[0]) => {
    setSelectedAppointment(apt)
    setDiagnosisDialogOpen(true)
  }

  const submitDiagnosis = async () => {
    if (selectedAppointment) {
      await updateAppointmentStatus(selectedAppointment.id, 'completed', diagnosis, prescription)
      if (user?.id) refreshData(user.id, 'doctor')
      setDiagnosisDialogOpen(false)
      setDiagnosis('')
      setPrescription('')
    }
  }

  // ─── Open chat with patient ───────────────────────────────────
  const openChat = (apt: any) => {
    const patientUserId = apt.patient?.userId || apt.patient?.user?.id
    const patientName = apt.patient?.user?.name || 'Pasien'
    setChatPatientUserId(patientUserId)
    setChatPatientName(patientName)
    setChatOpen(true)
    setNewMessage('')
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chatPatientUserId || !user?.id || sendingMessage) return
    setSendingMessage(true)
    try {
      await sendMessage({
        senderId: user.id,
        receiverId: chatPatientUserId,
        content: newMessage.trim(),
        type: 'text',
      })
      setNewMessage('')
    } finally {
      setSendingMessage(false)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  }

  const chatMessages_ = user?.id && chatPatientUserId
    ? getMessagesBetweenUsers(user.id, chatPatientUserId)
    : []

  const unreadFromPatient = chatMessages_.filter(
    m => m.senderId === chatPatientUserId && !m.isRead
  ).length

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
                            {/* ─── Tombol Chat ─────────────────── */}
                            <Button
                              variant="outline"
                              onClick={() => openChat(apt)}
                              className="relative"
                            >
                              <MessageSquare className="mr-1 h-4 w-4" />
                              Chat
                              {/* Badge unread count (opsional - hanya muncul jika ada pesan belum dibaca) */}
                              {(() => {
                                const patUId = apt.patient?.userId || apt.patient?.user?.id
                                if (!patUId || !user?.id) return null
                                const unread = getMessagesBetweenUsers(user.id, patUId).filter(
                                  m => m.senderId === patUId && !m.isRead
                                ).length
                                return unread > 0 ? (
                                  <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                                    {unread}
                                  </span>
                                ) : null
                              })()}
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

      {/* ════════════════════════════════════════════════════════════
          DIALOG INPUT DIAGNOSA
      ════════════════════════════════════════════════════════════ */}
      <Dialog open={diagnosisDialogOpen} onOpenChange={setDiagnosisDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
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

      {/* ════════════════════════════════════════════════════════════
          CHAT MODAL — floating bottom-right style
      ════════════════════════════════════════════════════════════ */}
      {chatOpen && chatPatientUserId && (
        <div
          className="fixed bottom-6 right-6 z-50 flex flex-col rounded-2xl shadow-2xl border border-border overflow-hidden"
          style={{ width: 360, height: 520 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-primary-foreground/20 flex items-center justify-center font-bold text-sm">
                {getInitials(chatPatientName)}
              </div>
              <div>
                <p className="font-semibold text-sm leading-tight">{chatPatientName}</p>
                <p className="text-xs text-primary-foreground/70">Pasien • Online</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:bg-primary-foreground/10 h-8 w-8 rounded-full"
                onClick={() => router.push('/doctor/chat')}
                title="Buka di halaman chat"
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:bg-primary-foreground/10 h-8 w-8 rounded-full"
                onClick={() => setChatOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages area */}
          <div
            ref={chatScrollRef}
            className="flex-1 overflow-y-auto p-3 space-y-2 bg-[#efeae2] dark:bg-muted/10"
            style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 39px, rgba(0,0,0,.03) 40px)' }}
          >
            {chatMessages_.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Mulai percakapan</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Kirim pesan pertama ke {chatPatientName}
                  </p>
                </div>
              </div>
            ) : (
              chatMessages_.map((msg) => {
                const isOwn = msg.senderId === user?.id
                return (
                  <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`relative max-w-[78%] px-3 py-2 text-sm shadow-sm rounded-lg ${
                        isOwn
                          ? 'bg-[#d9fdd3] dark:bg-emerald-900 text-foreground rounded-tr-none'
                          : 'bg-card text-foreground rounded-tl-none'
                      }`}
                    >
                      {/* Chat tail */}
                      <div className={`absolute top-0 w-2.5 h-2.5 ${isOwn ? '-right-2 text-[#d9fdd3] dark:text-emerald-900' : '-left-2 text-card'}`}>
                        <svg viewBox="0 0 8 13" width="8" height="13" className="fill-current">
                          {isOwn ? (
                            <path d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z" />
                          ) : (
                            <path d="M1.533 3.568L8 12.193V1H2.812C1.042 1 .474 2.156 1.533 3.568z" />
                          )}
                        </svg>
                      </div>

                      <p className="leading-snug">{msg.content}</p>
                      <div className={`flex items-center justify-end gap-1 text-[10px] mt-0.5 -mb-0.5 ${
                        isOwn ? 'text-emerald-700 dark:text-emerald-300' : 'text-muted-foreground'
                      }`}>
                        <span>{formatTime(msg.createdAt)}</span>
                        {isOwn && (
                          <CheckCheck className={`h-3 w-3 ${msg.isRead ? 'text-blue-500' : ''}`} />
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Input area */}
          <div className="bg-card px-3 py-2 flex items-center gap-2 border-t border-border shrink-0">
            <Input
              placeholder={`Pesan ke ${chatPatientName}...`}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              className="flex-1 rounded-full border-0 bg-muted/60 px-4 h-9 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
              disabled={sendingMessage}
            />
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sendingMessage}
              className="h-9 w-9 rounded-full bg-primary hover:bg-primary/90 shrink-0"
            >
              {sendingMessage ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4 ml-0.5" />
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
