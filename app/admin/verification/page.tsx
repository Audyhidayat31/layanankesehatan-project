import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { FileText, ExternalLink } from 'lucide-react'
import prisma from '@/lib/prisma'

export default async function AdminVerificationPage() {
  const doctors = await prisma.doctorProfile.findMany({
    include: { user: true }
  })

  const pharmacies = await prisma.pharmacyProfile.findMany({
    include: { user: true }
  })

  const requests = [
    ...doctors.map(d => ({
      id: d.id,
      name: d.user.name,
      type: 'DOCTOR',
      specialization: d.specialization,
      document: `STR_${d.user.name.replace(/\s+/g, '_')}.pdf`,
      submittedAt: d.user.createdAt.toISOString().split('T')[0],
      status: d.isVerified ? 'approved' : 'pending',
    })),
    ...pharmacies.map(p => ({
      id: p.id,
      name: p.name,
      type: 'PHARMACY',
      location: p.city,
      document: `SIA_${p.name.replace(/\s+/g, '_')}.pdf`,
      submittedAt: p.user.createdAt.toISOString().split('T')[0],
      status: p.isVerified ? 'approved' : 'pending',
    }))
  ]

  // Sort by date descending
  requests.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar role="admin" />
      <DashboardHeader role="admin" />
      
      <main className="lg:pl-64">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Verifikasi Berkas</h1>
            <p className="text-muted-foreground">
              Sistem telah dialihkan ke mode otomatis. Semua dokumen legal dari dokter dan apotek yang mendaftar akan langsung disetujui.
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Belum ada pendaftaran dokter atau apotek di database.
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-primary/10 text-xs text-primary font-bold">
                              {req.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
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
                        <a 
                          href={`/documents/${req.document}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-sm text-primary hover:underline"
                        >
                          <FileText className="mr-1 h-3 w-3" />
                          {req.document}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {req.submittedAt}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={req.status === 'approved' ? 'secondary' : 'outline'}
                          className={req.status === 'approved' ? 'bg-green-100 text-green-700' : ''}
                        >
                          {req.status === 'approved' ? 'Disetujui' : 'Menunggu'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      </main>
    </div>
  )
}
