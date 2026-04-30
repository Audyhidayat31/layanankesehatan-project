'use client'

import { useState, useMemo, useEffect } from 'react'
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

export default function DoctorsPage() {
  const { doctors, fetchDoctors } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState('all')
  const [sortBy, setSortBy] = useState('rating')
  const [priceRange, setPriceRange] = useState('all')

  useEffect(() => {
    fetchDoctors()
  }, [fetchDoctors])

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
      const query = searchQuery.toLowerCase()
      doctorList = doctorList.filter(
        (doc) =>
          doc.user?.name?.toLowerCase().includes(query) ||
          doc.specialization?.toLowerCase().includes(query) ||
          doc.hospital?.toLowerCase().includes(query)
      )
    }

    if (selectedSpecialization !== 'all') {
      doctorList = doctorList.filter((doc) => doc.specialization === selectedSpecialization)
    }

    if (priceRange !== 'all') {
      switch (priceRange) {
        case 'under-100k':
          doctorList = doctorList.filter((doc) => doc.price < 100000)
          break
        case '100k-200k':
          doctorList = doctorList.filter((doc) => doc.price >= 100000 && doc.price <= 200000)
          break
        case 'over-200k':
          doctorList = doctorList.filter((doc) => doc.price > 200000)
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
              <Card key={doctor.id} className="overflow-hidden transition-all hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-start gap-4">
                    <Avatar className="h-16 w-16 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
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

                  <Button className="w-full" asChild>
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
