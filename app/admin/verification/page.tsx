'use client'

import { useState } from 'react'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  ShieldCheck,
  CheckCircle,
  XCircle,
  FileText,
  ExternalLink,
} from 'lucide-react'

const initialRequests = [
  {
    id: 'req-1',
    name: 'dr. Sarah Wijaya',
    type: 'DOCTOR',
    specialization: 'Spesialis Jantung',
    document: 'STR_Sarah_Wijaya.pdf',
    submittedAt: '2024-04-20',
    status: 'pending',
  },
  {
    id: 'req-2',
    name: 'Apotek Sumber Sehat',
    type: 'PHARMACY',
    location: 'Surabaya',
    document: 'SIA_Sumber_Sehat.pdf',
    submittedAt: '2024-04-21',
    status: 'pending',
  },
  {
    id: 'req-3',
    name: 'dr. Ahmad Salim',
    type: 'DOCTOR',
    specialization: 'Dokter Umum',
    document: 'STR_Ahmad_Salim.pdf',
    submittedAt: '2024-04-18',
    status: 'approved',
  }
]

export default function AdminVerificationPage() {
  const [requests, setRequests] = useState(initialRequests)

  const handleAction = (id: string, status: 'approved' | 'rejected') => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status } : req
    ))
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar role="admin" />
      <DashboardHeader role="admin" />
      
      <main className="lg:pl-64">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Verifikasi Berkas</h1>
            <p className="text-muted-foreground">
              Tinjau dan verifikasi dokumen legal dari dokter dan apotek
            </p>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pemohon</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Dokumen</TableHead>
                  <TableHead>Tanggal Pengajuan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary/10 text-xs text-primary font-bold">
                            {req.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{req.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {req.type === 'DOCTOR' ? req.specialization : req.location}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{req.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="link" size="sm" className="h-auto p-0 text-primary">
                        <FileText className="mr-1 h-3 w-3" />
                        {req.document}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </Button>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {req.submittedAt}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={req.status === 'approved' ? 'secondary' : req.status === 'pending' ? 'outline' : 'destructive'}
                        className={req.status === 'approved' ? 'bg-green-100 text-green-700' : ''}
                      >
                        {req.status === 'approved' ? 'Disetujui' : req.status === 'pending' ? 'Menunggu' : 'Ditolak'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {req.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive hover:bg-red-50"
                            onClick={() => handleAction(req.id, 'rejected')}
                          >
                            <XCircle className="mr-1 h-4 w-4" />
                            Tolak
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleAction(req.id, 'approved')}
                          >
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Setujui
                          </Button>
                        </div>
                      )}
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
