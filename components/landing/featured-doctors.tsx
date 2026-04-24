'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Star, MapPin, Clock, CheckCircle } from 'lucide-react'
import { mockDoctors } from '@/lib/mock-data'

export function FeaturedDoctors() {
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

  return (
    <section className="bg-muted/50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="mb-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Dokter Terpopuler
            </h2>
            <p className="text-muted-foreground">
              Dokter dengan rating tertinggi dan pengalaman terbaik
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/doctors">Lihat Semua Dokter</Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {mockDoctors.map((doctor) => (
            <Card
              key={doctor.id}
              className="group overflow-hidden transition-all hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <Avatar className="h-16 w-16 border-2 border-primary/20">
                    <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
                      {getInitials(doctor.user.name)}
                    </AvatarFallback>
                  </Avatar>
                  {doctor.isOnline && (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700"
                    >
                      <span className="mr-1 h-2 w-2 rounded-full bg-green-500" />
                      Online
                    </Badge>
                  )}
                </div>

                <div className="mb-4 space-y-1">
                  <div className="flex items-center gap-1">
                    <h3 className="font-semibold text-foreground">
                      {doctor.user.name}
                    </h3>
                    {doctor.isVerified && (
                      <CheckCircle className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <p className="text-sm text-primary">{doctor.specialization}</p>
                </div>

                <div className="mb-4 space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{doctor.hospital}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{doctor.experience} tahun pengalaman</span>
                  </div>
                </div>

                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-foreground">
                      {doctor.rating}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({doctor.reviewCount})
                    </span>
                  </div>
                  <span className="font-semibold text-primary">
                    {formatPrice(doctor.price)}
                  </span>
                </div>

                <Button className="w-full" asChild>
                  <Link href={`/doctors/${doctor.id}`}>Buat Janji</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
