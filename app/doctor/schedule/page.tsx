'use client'

import { useState } from 'react'
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
import { Calendar, Clock, Plus, Trash2, Edit, Save } from 'lucide-react'

interface TimeSlot {
  id: string
  day: string
  startTime: string
  endTime: string
  isActive: boolean
}

const daysOfWeek = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

const initialSchedule: TimeSlot[] = [
  { id: '1', day: 'Senin', startTime: '08:00', endTime: '12:00', isActive: true },
  { id: '2', day: 'Senin', startTime: '14:00', endTime: '17:00', isActive: true },
  { id: '3', day: 'Selasa', startTime: '08:00', endTime: '12:00', isActive: true },
  { id: '4', day: 'Rabu', startTime: '09:00', endTime: '15:00', isActive: true },
  { id: '5', day: 'Kamis', startTime: '08:00', endTime: '12:00', isActive: true },
  { id: '6', day: 'Kamis', startTime: '14:00', endTime: '18:00', isActive: false },
  { id: '7', day: 'Jumat', startTime: '10:00', endTime: '16:00', isActive: true },
]

export default function DoctorSchedulePage() {
  const [schedule, setSchedule] = useState<TimeSlot[]>(initialSchedule)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [newSlot, setNewSlot] = useState({
    day: '',
    startTime: '',
    endTime: '',
  })

  const toggleSlot = (id: string) => {
    setSchedule(
      schedule.map((slot) =>
        slot.id === id ? { ...slot, isActive: !slot.isActive } : slot
      )
    )
  }

  const deleteSlot = (id: string) => {
    setSchedule(schedule.filter((slot) => slot.id !== id))
  }

  const addSlot = () => {
    if (newSlot.day && newSlot.startTime && newSlot.endTime) {
      setSchedule([
        ...schedule,
        {
          id: Date.now().toString(),
          ...newSlot,
          isActive: true,
        },
      ])
      setNewSlot({ day: '', startTime: '', endTime: '' })
      setAddDialogOpen(false)
    }
  }

  const getScheduleByDay = (day: string) => {
    return schedule.filter((slot) => slot.day === day)
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
                Kelola jadwal praktik dan ketersediaan Anda
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
                    Tambahkan slot waktu praktik baru
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <FieldGroup>
                    <Field>
                      <FieldLabel>Hari</FieldLabel>
                      <Select
                        value={newSlot.day}
                        onValueChange={(value) => setNewSlot({ ...newSlot, day: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih hari" />
                        </SelectTrigger>
                        <SelectContent>
                          {daysOfWeek.map((day) => (
                            <SelectItem key={day} value={day}>
                              {day}
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
                    <Button onClick={addSlot}>Tambah</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {daysOfWeek.map((day) => {
              const daySchedule = getScheduleByDay(day)
              return (
                <Card key={day}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-base">
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        {day}
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
                              onCheckedChange={() => toggleSlot(slot.id)}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => deleteSlot(slot.id)}
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

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Pengaturan Konsultasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <h4 className="font-medium text-foreground">Konsultasi Online</h4>
                  <p className="text-sm text-muted-foreground">
                    Izinkan pasien untuk konsultasi via chat
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <h4 className="font-medium text-foreground">Konsultasi Offline</h4>
                  <p className="text-sm text-muted-foreground">
                    Izinkan pasien untuk konsultasi tatap muka di klinik
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <h4 className="font-medium text-foreground">Booking Otomatis</h4>
                  <p className="text-sm text-muted-foreground">
                    Terima booking pasien secara otomatis tanpa konfirmasi manual
                  </p>
                </div>
                <Switch />
              </div>
              <div className="rounded-lg border border-border p-4">
                <h4 className="mb-2 font-medium text-foreground">Durasi Konsultasi</h4>
                <Select defaultValue="30">
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
