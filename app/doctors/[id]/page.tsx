'use client'

import { useState, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Star,
  MapPin,
  Clock,
  CheckCircle,
  GraduationCap,
  Calendar,
  Video,
  Building,
  ArrowLeft,
  MessageSquare,
} from 'lucide-react'
import { useAuthStore, useAppStore } from '@/lib/store'
import { useEffect } from 'react'

export default function DoctorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [from, setFrom] = useState<string | null>(null)
  const { user, isAuthenticated } = useAuthStore()
  const { createAppointment, doctors, fetchDoctors } = useAppStore()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setFrom(params.get('from'))
    fetchDoctors()
  }, [fetchDoctors])
  
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [appointmentType, setAppointmentType] = useState<'online' | 'offline'>('online')
  const [complaint, setComplaint] = useState('')
  const [practiceAddress, setPracticeAddress] = useState('')
  const [isBooking, setIsBooking] = useState(false)
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false)
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)

  const doctor = doctors.find((d) => d.id === resolvedParams.id)

  useEffect(() => {
    if (doctor) {
      setPracticeAddress(doctor.practiceAddress || doctor.hospital || '')
    }
  }, [doctor])

  useEffect(() => {
    if (selectedDate && doctor) {
      setIsLoadingSlots(true)
      fetch(`/api/appointments/booked?doctorId=${doctor.id}&date=${selectedDate}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setBookedSlots(data.bookedSlots)
            // Reset selected time if it's now booked
            if (data.bookedSlots.includes(selectedTime)) {
              setSelectedTime('')
            }
          }
        })
        .catch((err) => console.error('Failed to fetch booked slots', err))
        .finally(() => setIsLoadingSlots(false))
    } else {
      setBookedSlots([])
    }
  }, [selectedDate, doctor, selectedTime])

  if (!doctor) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="mb-2 text-2xl font-bold">Dokter tidak ditemukan</h1>
            <p className="mb-4 text-muted-foreground">
              Dokter yang Anda cari tidak tersedia
            </p>
            <Button asChild>
              <Link href="/doctors">Kembali ke Daftar Dokter</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
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
      .filter((n) => !n.startsWith('Dr'))
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const generateDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' }),
      })
    }
    return dates
  }

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30',
  ]

  const handleBookAppointment = async () => {
    if (!isAuthenticated || !user) {
      router.push('/login')
      return
    }

    if (!selectedDate || !selectedTime) {
      alert('Pilih tanggal dan waktu konsultasi')
      return
    }

    if (appointmentType === 'offline' && !practiceAddress.trim()) {
      alert('Alamat praktek dokter harus diisi untuk konsultasi offline')
      return
    }

    setIsBooking(true)
    try {
      // Dapatkan patientProfile ID yang sesungguhnya dari database
      const profileRes = await fetch(`/api/patient-profile?userId=${user.id}`)
      let realPatientId: string

      if (profileRes.ok) {
        const profileJson = await profileRes.json()
        realPatientId = profileJson.patientProfile?.id
      }

      if (!realPatientId!) {
        alert('Profil pasien tidak ditemukan. Pastikan Anda sudah terdaftar sebagai pasien.')
        setIsBooking(false)
        return
      }

      await createAppointment({
        patientId: realPatientId,
        patient: {
          id: realPatientId,
          userId: user.id,
          user: user,
        },
        doctorId: doctor.id,
        doctor: doctor,
        date: selectedDate,
        time: selectedTime,
        type: appointmentType,
        status: 'pending',
        complaint: complaint,
        practiceAddress: appointmentType === 'offline' ? practiceAddress : undefined,
      })

      setBookingDialogOpen(false)
      router.push('/patient/appointments')
    } catch (error) {
      console.error('Booking failed:', error)
      alert('Gagal membuat janji. Silakan coba lagi.')
    } finally {
      setIsBooking(false)
    }
  }

  const dates = generateDates()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          {from === 'chat' ? (
            <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Halaman Chat
            </Button>
          ) : (
            <Button variant="ghost" className="mb-6" asChild>
              <Link href="/doctors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Daftar Dokter
              </Link>
            </Button>
          )}

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-6 md:flex-row md:items-start">
                    <Avatar className="h-32 w-32 border-4 border-primary/20">
                      <AvatarFallback className="bg-primary/10 text-3xl font-semibold text-primary">
                        {getInitials(doctor.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <h1 className="text-2xl font-bold text-foreground">
                          {doctor.user.name}
                        </h1>
                        {doctor.isVerified && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <p className="mb-4 text-lg text-primary">{doctor.specialization}</p>
                      
                      <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium text-foreground">{doctor.rating}</span>
                          <span>({doctor.reviewCount} ulasan)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{doctor.experience} tahun pengalaman</span>
                        </div>
                        {doctor.isOnline && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            <span className="mr-1 h-2 w-2 rounded-full bg-green-500" />
                            Online sekarang
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{doctor.hospital}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Tentang Dokter
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{doctor.bio}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Pendidikan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {doctor.education.map((edu, index) => (
                      <li key={index} className="flex items-center gap-2 text-muted-foreground">
                        <span className="h-2 w-2 rounded-full bg-primary" />
                        {edu}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Buat Janji Konsultasi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-primary/5 p-4">
                    <span className="text-sm text-muted-foreground">Biaya Konsultasi</span>
                    <p className="text-2xl font-bold text-primary">
                      {formatPrice(doctor.price)}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant={appointmentType === 'online' ? 'default' : 'outline'}
                      className="flex-1"
                      onClick={() => setAppointmentType('online')}
                    >
                      <Video className="mr-2 h-4 w-4" />
                      Online
                    </Button>
                    <Button
                      variant={appointmentType === 'offline' ? 'default' : 'outline'}
                      className="flex-1"
                      onClick={() => setAppointmentType('offline')}
                    >
                      <Building className="mr-2 h-4 w-4" />
                      Offline
                    </Button>
                  </div>

                  <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full" size="lg">
                        <Calendar className="mr-2 h-4 w-4" />
                        Pilih Jadwal
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Pilih Jadwal Konsultasi</DialogTitle>
                        <DialogDescription>
                          Pilih tanggal dan waktu yang tersedia untuk konsultasi
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <FieldLabel className="mb-2 block">Pilih Tanggal</FieldLabel>
                          <div className="grid grid-cols-4 gap-2">
                            {dates.map((date) => (
                              <button
                                key={date.value}
                                onClick={() => setSelectedDate(date.value)}
                                className={`rounded-lg border p-2 text-center text-sm transition-colors ${
                                  selectedDate === date.value
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-border hover:border-primary/50'
                                }`}
                              >
                                {date.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <FieldLabel className="mb-2 flex items-center gap-2">
                            Pilih Waktu
                            {isLoadingSlots && <Spinner className="h-3 w-3" />}
                          </FieldLabel>
                          <div className="grid grid-cols-4 gap-2">
                            {timeSlots.map((time) => {
                              const isBooked = bookedSlots.includes(time)
                              return (
                                <button
                                  key={time}
                                  onClick={() => setSelectedTime(time)}
                                  disabled={isBooked || isLoadingSlots}
                                  className={`rounded-lg border p-2 text-center text-sm transition-colors ${
                                    isBooked
                                      ? 'border-border bg-muted text-muted-foreground opacity-50 cursor-not-allowed'
                                      : selectedTime === time
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-border hover:border-primary/50'
                                  }`}
                                >
                                  {time}
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        <Field>
                          <FieldLabel htmlFor="complaint">Keluhan (opsional)</FieldLabel>
                          <Textarea
                            id="complaint"
                            placeholder="Ceritakan keluhan atau gejala Anda..."
                            value={complaint}
                            onChange={(e) => setComplaint(e.target.value)}
                            rows={3}
                          />
                        </Field>

                        {appointmentType === 'offline' && (
                          <Field>
                            <FieldLabel htmlFor="practiceAddress">Alamat Praktek Dokter (Pertemuan Offline)</FieldLabel>
                            <Input
                              id="practiceAddress"
                              placeholder="Masukkan alamat lengkap praktek dokter..."
                              value={practiceAddress}
                              onChange={(e) => setPracticeAddress(e.target.value)}
                              required
                            />
                          </Field>
                        )}

                        <Button
                          className="w-full"
                          onClick={handleBookAppointment}
                          disabled={!selectedDate || !selectedTime || isBooking}
                        >
                          {isBooking ? (
                            <>
                              <Spinner className="mr-2 h-4 w-4" />
                              Memproses...
                            </>
                          ) : (
                            `Konfirmasi - ${formatPrice(doctor.price)}`
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button variant="outline" className="w-full">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Chat Dokter
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
