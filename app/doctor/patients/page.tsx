'use client'

import { useState } from 'react'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Search,
  User,
  FileText,
  MessageSquare,
  MoreVertical,
} from 'lucide-react'

const initialPatients = [
  { id: 'p1', name: 'Budi Santoso', lastVisit: '2024-04-20', condition: 'Hipertensi', totalVisits: 5 },
  { id: 'p2', name: 'Siti Aminah', lastVisit: '2024-04-18', condition: 'Flu & Batuk', totalVisits: 2 },
  { id: 'p3', name: 'Andi Pratama', lastVisit: '2024-04-15', condition: 'Diabetes Melitus', totalVisits: 12 },
  { id: 'p4', name: 'Dewi Lestari', lastVisit: '2024-04-10', condition: 'Asma', totalVisits: 8 },
  { id: 'p5', name: 'Ahmad Faisal', lastVisit: '2024-04-05', condition: 'Check-up Rutin', totalVisits: 3 },
]

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState(initialPatients)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar role="doctor" />
      <DashboardHeader role="doctor" />
      
      <main className="lg:pl-64">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Daftar Pasien</h1>
            <p className="text-muted-foreground">
              Kelola data pasien dan riwayat medis yang Anda tangani
            </p>
          </div>

          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari nama pasien..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pasien</TableHead>
                  <TableHead>Kunjungan Terakhir</TableHead>
                  <TableHead>Kondisi Utama</TableHead>
                  <TableHead>Total Konsultasi</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary/10 text-xs text-primary font-bold">
                            {getInitials(patient.name)}
                          </AvatarFallback>
                        </Avatar>
                        <p className="font-medium">{patient.name}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{patient.lastVisit}</TableCell>
                    <TableCell>
                      <span className="text-sm font-medium text-foreground">{patient.condition}</span>
                    </TableCell>
                    <TableCell className="text-sm">{patient.totalVisits} kali</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </main>
    </div>
  )
}
