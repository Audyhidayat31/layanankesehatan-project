'use client'

import { useState } from 'react'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, FileText, Calendar, Stethoscope } from 'lucide-react'
import { mockAppointments } from '@/lib/mock-data'

export default function PatientRecordsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  // Filter only completed appointments with diagnosis as records
  const records = mockAppointments.filter(
    (apt) => apt.status === 'completed' && apt.diagnosis
  )

  const filteredRecords = records.filter((record) => 
    record.doctor.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar role="patient" />
      <DashboardHeader role="patient" />
      
      <main className="lg:pl-64">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Rekam Medis</h1>
            <p className="text-muted-foreground">
              Riwayat konsultasi dan diagnosis medis Anda
            </p>
          </div>

          <div className="mb-6 flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Cari dokter atau diagnosis..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => (
                <Card key={record.id}>
                  <CardHeader className="pb-3 flex flex-row items-center justify-between border-b border-border bg-muted/20">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-medium">
                          Konsultasi dengan {record.doctor.user.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>{record.date}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-primary/5 text-primary">
                      Selesai
                    </Badge>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">Keluhan</h4>
                          <p className="text-sm text-foreground">{record.complaint}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">Diagnosis</h4>
                          <p className="text-sm font-medium text-foreground">{record.diagnosis}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">Catatan Dokter</h4>
                          <p className="text-sm text-foreground">{record.notes}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">Dokter Pemeriksa</h4>
                          <div className="flex items-center gap-2 text-sm text-foreground">
                            <Stethoscope className="h-4 w-4 text-muted-foreground" />
                            <span>{record.doctor.specialization}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center bg-card rounded-lg border border-border">
                <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
                <h3 className="mb-2 text-lg font-medium text-foreground">
                  Tidak ada rekam medis
                </h3>
                <p className="text-muted-foreground">
                  Belum ada riwayat medis atau hasil pencarian tidak ditemukan.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
