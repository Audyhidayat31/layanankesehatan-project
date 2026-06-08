'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Search,
  Star,
  MapPin,
  Clock,
  CheckCircle,
  Filter,
  SlidersHorizontal,
} from 'lucide-react'
import { specializations } from '@/lib/mock-data'
import { useAppStore } from '@/lib/store'

const symptomToSpecializationMap: Record<string, string[]> = {
  demam: ['Dokter Umum', 'Spesialis Anak'],
  batuk: ['Dokter Umum', 'Spesialis Anak', 'Spesialis THT', 'Spesialis Paru'],
  pilek: ['Dokter Umum', 'Spesialis Anak', 'Spesialis THT'],
  flu: ['Dokter Umum', 'Spesialis Anak', 'Spesialis THT'],
  pusing: ['Dokter Umum', 'Spesialis Saraf'],
  'sakit kepala': ['Dokter Umum', 'Spesialis Saraf', 'Psikiater'],
  lemas: ['Dokter Umum'],
  jantung: ['Spesialis Jantung'],
  'dada sakit': ['Spesialis Jantung', 'Spesialis Paru'],
  'sesak napas': ['Spesialis Jantung', 'Spesialis Paru'],
  debar: ['Spesialis Jantung'],
  hipertensi: ['Spesialis Jantung', 'Dokter Umum'],
  'tekanan darah': ['Spesialis Jantung', 'Dokter Umum'],
  kulit: ['Spesialis Kulit'],
  gatal: ['Spesialis Kulit'],
  ruam: ['Spesialis Kulit', 'Spesialis Anak'],
  jerawat: ['Spesialis Kulit'],
  'alergi kulit': ['Spesialis Kulit', 'Spesialis Anak'],
  anak: ['Spesialis Anak'],
  bayi: ['Spesialis Anak'],
  imunisasi: ['Spesialis Anak'],
  tumbuh: ['Spesialis Anak'],
  kembang: ['Spesialis Anak'],
  mata: ['Spesialis Mata'],
  perih: ['Spesialis Mata'],
  'mata merah': ['Spesialis Mata'],
  kabur: ['Spesialis Mata'],
  minus: ['Spesialis Mata'],
  telinga: ['Spesialis THT'],
  hidung: ['Spesialis THT'],
  tenggorokan: ['Spesialis THT'],
  amandel: ['Spesialis THT'],
  sinus: ['Spesialis THT'],
  saraf: ['Spesialis Saraf'],
  kebas: ['Spesialis Saraf'],
  kesemutan: ['Spesialis Saraf'],
  stroke: ['Spesialis Saraf'],
  migrain: ['Spesialis Saraf'],
  'saraf terjepit': ['Spesialis Saraf'],
  asma: ['Spesialis Paru', 'Spesialis Anak', 'Dokter Umum'],
  'paru-paru': ['Spesialis Paru'],
  tbc: ['Spesialis Paru'],
  flek: ['Spesialis Paru', 'Spesialis Anak'],
  operasi: ['Spesialis Bedah'],
  'luka dalam': ['Spesialis Bedah'],
  bedah: ['Spesialis Bedah'],
  benjolan: ['Spesialis Bedah', 'Dokter Umum'],
  stres: ['Psikiater'],
  depresi: ['Psikiater'],
  cemas: ['Psikiater'],
  mental: ['Psikiater'],
  tidur: ['Psikiater'],
  insomnia: ['Psikiater'],
  jiwa: ['Psikiater'],
  gigi: ['Dokter Gigi'],
  gusi: ['Dokter Gigi'],
  'gigi berlubang': ['Dokter Gigi'],
  'karang gigi': ['Dokter Gigi'],
  'sakit gigi': ['Dokter Gigi'],
}

function DoctorsPageContent() {
  const { doctors, fetchDoctors } = useAppStore()
  const searchParams = useSearchParams()
  const searchParamQuery = searchParams.get('search') || ''
  const searchParamSpecialization = searchParams.get('specialization') || 'all'

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState('all')
  const [sortBy, setSortBy] = useState('rating')
  const [priceRange, setPriceRange] = useState('all')

  useEffect(() => {
    fetchDoctors()
  }, [fetchDoctors])

  useEffect(() => {
    if (searchParamQuery) {
      setSearchQuery(searchParamQuery)
    }
    if (searchParamSpecialization && searchParamSpecialization !== 'all') {
      const matched = specializations.find(
        (spec) =>
          spec.toLowerCase().replace(/ /g, '-') === searchParamSpecialization.toLowerCase() ||
          spec.toLowerCase() === searchParamSpecialization.toLowerCase()
      )
      if (matched) {
        setSelectedSpecialization(matched)
      } else {
        setSelectedSpecialization(searchParamSpecialization)
      }
    }
  }, [searchParamQuery, searchParamSpecialization])

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

  const filteredDoctors = useMemo(() => {
    let doctorList = [...doctors]

    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim()
      
      // Find specializations that match based on symptoms
      const matchedSpecsFromSymptoms: string[] = []
      Object.entries(symptomToSpecializationMap).forEach(([symptomKey, specs]) => {
        if (query.includes(symptomKey) || symptomKey.includes(query)) {
          matchedSpecsFromSymptoms.push(...specs)
        }
      })

      doctorList = doctorList.filter(
        (doc) =>
          doc.user?.name?.toLowerCase().includes(query) ||
          doc.specialization?.toLowerCase().includes(query) ||
          doc.hospital?.toLowerCase().includes(query) ||
          (doc.bio && doc.bio.toLowerCase().includes(query)) ||
          (doc.education && doc.education.some(edu => edu.toLowerCase().includes(query))) ||
          matchedSpecsFromSymptoms.some(spec => 
            doc.specialization?.toLowerCase().includes(spec.toLowerCase())
          )
      )
    }

    if (selectedSpecialization !== 'all') {
      const selectedLow = selectedSpecialization.toLowerCase().replace(/-/g, ' ')
      doctorList = doctorList.filter((doc) => {
        const docSpec = (doc.specialization || '').toLowerCase().replace(/-/g, ' ')
        if (!docSpec) return false
        return docSpec.includes(selectedLow) || selectedLow.includes(docSpec)
      })
    }

    if (priceRange !== 'all') {
      switch (priceRange) {
        case 'under-100k':
          doctorList = doctorList.filter((doc) => doc.price <= 100000)
          break
        case '100k-200k':
          doctorList = doctorList.filter((doc) => doc.price >= 100000 && doc.price <= 200000)
          break
        case 'over-200k':
          doctorList = doctorList.filter((doc) => doc.price >= 200000)
          break
      }
    }

    switch (sortBy) {
      case 'rating':
        doctorList.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'price-low':
        doctorList.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        doctorList.sort((a, b) => b.price - a.price)
        break
      case 'experience':
        doctorList.sort((a, b) => b.experience - a.experience)
        break
    }

    return doctorList
  }, [searchQuery, selectedSpecialization, sortBy, priceRange, doctors])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-foreground">Cari Dokter</h1>
            <p className="text-muted-foreground">
              Temukan dokter terbaik sesuai kebutuhan kesehatan Anda
            </p>
          </div>

          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1 lg:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari nama dokter, spesialis, atau rumah sakit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Spesialisasi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Spesialis</SelectItem>
                  {specializations.map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Harga" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Harga</SelectItem>
                  <SelectItem value="under-100k">Di bawah Rp100.000</SelectItem>
                  <SelectItem value="100k-200k">Rp100.000 - Rp200.000</SelectItem>
                  <SelectItem value="over-200k">Di atas Rp200.000</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px]">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Urutkan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Rating Tertinggi</SelectItem>
                  <SelectItem value="price-low">Harga Terendah</SelectItem>
                  <SelectItem value="price-high">Harga Tertinggi</SelectItem>
                  <SelectItem value="experience">Pengalaman Terbanyak</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mb-4 text-sm text-muted-foreground">
            Menampilkan {filteredDoctors.length} dokter
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="group overflow-hidden border-border/40 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-primary/30">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-start gap-4">
                    <Avatar className="h-16 w-16 border-2 border-primary/20 transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-md">
                      <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary transition-colors duration-300 group-hover:bg-primary/20">
                        {getInitials(doctor.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        <h3 className="font-semibold text-foreground">{doctor.user.name}</h3>
                        {doctor.isVerified && (
                          <CheckCircle className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <p className="text-sm text-primary">{doctor.specialization}</p>
                      {doctor.isOnline && (
                        <Badge variant="secondary" className="mt-1 bg-green-100 text-green-700">
                          <span className="mr-1 h-2 w-2 rounded-full bg-green-500" />
                          Online
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="mb-4 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span className="truncate">{doctor.hospital}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 shrink-0" />
                      <span>{doctor.experience} tahun pengalaman</span>
                    </div>
                  </div>

                  <div className="mb-4 flex items-center justify-between border-t border-border pt-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-foreground">{doctor.rating}</span>
                      <span className="text-sm text-muted-foreground">
                        ({doctor.reviewCount} ulasan)
                      </span>
                    </div>
                    <span className="font-semibold text-primary">
                      {formatPrice(doctor.price)}
                    </span>
                  </div>

                  <Button className="w-full transition-all duration-300 hover:shadow-md group-hover:bg-primary/90" asChild>
                    <Link href={`/doctors/${doctor.id}`}>Lihat Profil</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDoctors.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Search className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="mb-2 text-lg font-medium text-foreground">Dokter tidak ditemukan</h3>
              <p className="text-muted-foreground">
                Coba ubah filter atau kata kunci pencarian Anda
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function DoctorsPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-muted/30 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Memuat data dokter...</p>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <DoctorsPageContent />
    </Suspense>
  )
}
