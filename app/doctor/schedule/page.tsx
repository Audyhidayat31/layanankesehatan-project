'use client'

import { useState, useEffect } from 'react'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar, Clock, Plus, Trash2 } from 'lucide-react'
import { useAuthStore, useAppStore } from '@/lib/store'
import { Spinner } from '@/components/ui/spinner'

interface TimeSlot {
  id: string
  date: string
  startTime: string
  endTime: string
  isActive: boolean
}

const generateNextDays = (numDays: number) => {
  const dates = []
  const today = new Date()
  for (let i = 0; i < numDays; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`
    const label = d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })
    dates.push({ date: dateStr, label })
  }
  return dates
}

export default function DoctorSchedulePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [newSlot, setNewSlot] = useState({
    date: '',
    startTime: '',
    endTime: '',
  })
  const [isUpdatingSetting, setIsUpdatingSetting] = useState(false)
  
  const { user } = useAuthStore()
  const { doctors, fetchDoctors, timeSlots, fetchDoctorTimeSlots, addTimeSlot, updateTimeSlotStatus, deleteTimeSlot } = useAppStore()
  
  const doctor = doctors.find((d) => d.userId === user?.id)
  const schedule = timeSlots.filter(t => t.doctorId === doctor?.id)

  useEffect(() => {
    fetchDoctors()
  }, [fetchDoctors])

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!doctor?.id) return
      setIsLoading(true)
      await fetchDoctorTimeSlots(doctor.id)
      setIsLoading(false)
    }

    fetchSchedule()
  }, [doctor?.id, fetchDoctorTimeSlots])

  const toggleSlot = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus
    await updateTimeSlotStatus(id, newStatus)
  }

  const deleteSlot = async (id: string) => {
    await deleteTimeSlot(id)
  }

  const addSlot = async () => {
    if (newSlot.date && newSlot.startTime && newSlot.endTime && doctor?.id) {
      await addTimeSlot({
        doctorId: doctor.id,
        date: newSlot.date,
        startTime: newSlot.startTime,
        endTime: newSlot.endTime,
        isActive: true,
        isBooked: false,
      })
      setNewSlot({ date: '', startTime: '', endTime: '' })
      setAddDialogOpen(false)
    }
  }

  const handleUpdateSetting = async (field: string, value: boolean | string) => {
    if (!doctor) return
    setIsUpdatingSetting(true)
    try {
      await fetch('/api/doctor-profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: doctor.id,
          [field]: value
        })
      })
      await fetchDoctors() // Refresh the local state
    } catch (error) {
      console.error('Failed to update setting:', error)
    } finally {
      setIsUpdatingSetting(false)
    }
  }

  const nextDays = generateNextDays(7) // Tampilkan jadwal 7 hari ke depan

  const getScheduleByDate = (dateStr: string) => {
    return schedule.filter((slot) => {
      // Pastikan format date dari DB bisa di-compare dengan dateStr (YYYY-MM-DD)
      const slotDate = typeof slot.date === 'string' ? slot.date.split('T')[0] : new Date(slot.date).toISOString().split('T')[0]
      return slotDate === dateStr
    })
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar role="doctor" />
      <DashboardHeader role="doctor" />

      <main className="lg:pl-64">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Jadwal Praktik</h1>
              <p className="text-muted-foreground">
                Kelola jadwal praktik dan ketersediaan Anda pada tanggal tertentu
              </p>
            </div>
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Jadwal
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Tambah Jadwal Baru</DialogTitle>
                  <DialogDescription>
                    Tambahkan slot waktu praktik untuk tanggal tertentu
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <FieldGroup>
                    <Field>
                      <FieldLabel>Tanggal</FieldLabel>
                      <Select
                        value={newSlot.date}
                        onValueChange={(value) => setNewSlot({ ...newSlot, date: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih tanggal" />
                        </SelectTrigger>
                        <SelectContent>
                          {nextDays.map((day) => (
                            <SelectItem key={day.date} value={day.date}>
                              {day.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel htmlFor="startTime">Jam Mulai</FieldLabel>
                        <Input
                          id="startTime"
                          type="time"
                          value={newSlot.startTime}
                          onChange={(e) =>
                            setNewSlot({ ...newSlot, startTime: e.target.value })
                          }
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="endTime">Jam Selesai</FieldLabel>
                        <Input
                          id="endTime"
                          type="time"
                          value={newSlot.endTime}
                          onChange={(e) =>
                            setNewSlot({ ...newSlot, endTime: e.target.value })
                          }
                        />
                      </Field>
                    </div>
                  </FieldGroup>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                      Batal
                    </Button>
                    <Button onClick={addSlot} disabled={!newSlot.date || !newSlot.startTime || !newSlot.endTime}>Tambah</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner className="h-8 w-8" />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {nextDays.map((day) => {
                const daySchedule = getScheduleByDate(day.date)
                return (
                  <Card key={day.date}>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between text-base">
                        <span className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span className="truncate" title={day.label}>{day.label}</span>
                        </span>
                        <Badge variant="secondary">
                          {daySchedule.filter((s) => s.isActive).length} slot
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {daySchedule.length > 0 ? (
                        daySchedule.map((slot) => (
                          <div
                            key={slot.id}
                            className={`flex items-center justify-between rounded-lg border p-3 ${slot.isActive
                                ? 'border-primary/20 bg-primary/5'
                                : 'border-border bg-muted/50'
                              }`}
                          >
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span
                                className={`text-sm font-medium ${slot.isActive ? 'text-foreground' : 'text-muted-foreground line-through'
                                  }`}
                              >
                                {slot.startTime} - {slot.endTime}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={slot.isActive}
                                onCheckedChange={() => toggleSlot(slot.id, slot.isActive)}
                                title={slot.isActive ? "Nonaktifkan jadwal ini" : "Aktifkan jadwal ini"}
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => deleteSlot(slot.id)}
                                title="Hapus jadwal"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                          Tidak ada jadwal
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Pengaturan Konsultasi
                {isUpdatingSetting && <Spinner className="h-4 w-4" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <h4 className="font-medium text-foreground">Konsultasi Online</h4>
                  <p className="text-sm text-muted-foreground">
                    Izinkan pasien untuk konsultasi via chat
                  </p>
                </div>
                <Switch 
                  checked={doctor?.isOnlineEnabled !== false} 
                  onCheckedChange={(val) => handleUpdateSetting('isOnlineEnabled', val)}
                  disabled={isUpdatingSetting}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <h4 className="font-medium text-foreground">Konsultasi Offline</h4>
                  <p className="text-sm text-muted-foreground">
                    Izinkan pasien untuk konsultasi tatap muka di klinik
                  </p>
                </div>
                <Switch 
                  checked={doctor?.isOfflineEnabled !== false}
                  onCheckedChange={(val) => handleUpdateSetting('isOfflineEnabled', val)}
                  disabled={isUpdatingSetting}
                />
              </div>
              <div className="rounded-lg border border-border p-4">
                <h4 className="mb-2 font-medium text-foreground">Durasi Konsultasi</h4>
                <Select 
                  value={doctor?.consultationDuration?.toString() || "30"}
                  onValueChange={(val) => handleUpdateSetting('consultationDuration', val)}
                  disabled={isUpdatingSetting}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 menit</SelectItem>
                    <SelectItem value="30">30 menit</SelectItem>
                    <SelectItem value="45">45 menit</SelectItem>
                    <SelectItem value="60">60 menit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
