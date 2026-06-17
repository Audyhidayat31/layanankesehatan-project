import Link from 'next/link'
import { AuthLink } from '@/components/auth-link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Star, MapPin, Clock, CheckCircle } from 'lucide-react'
import prisma from '@/lib/prisma'

export async function FeaturedDoctors() {
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

  const popularDoctorsData = await prisma.doctorProfile.findMany({
    include: {
      user: true,
    },
    orderBy: {
      rating: 'desc',
    },
    take: 10,
  })

  const popularDoctors = [...popularDoctorsData]
    .sort((a, b) => {
      if (b.rating !== a.rating) {
        return b.rating - a.rating
      }
      const aTime = a.user?.createdAt ? new Date(a.user.createdAt).getTime() : 0
      const bTime = b.user?.createdAt ? new Date(b.user.createdAt).getTime() : 0
      return bTime - aTime
    })
    .slice(0, 4)

  return (
    <section className="bg-muted/30 py-24 relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end slide-up-fade">
          <div className="max-w-2xl">
            <span className="text-primary font-semibold tracking-wider uppercase text-sm mb-4 block">Top Rating</span>
            <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
              Dokter <span className="text-gradient">Terpopuler</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Konsultasi dengan dokter pilihan yang memiliki rating tertinggi dan pengalaman terbaik dari ribuan pasien.
            </p>
          </div>
          <Button variant="outline" size="lg" className="rounded-full shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 border-primary/20 hover:bg-primary/5 hover:text-primary" asChild>
            <Link href="/doctors">Lihat Semua Dokter</Link>
          </Button>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 slide-up-fade stagger-1">
          {popularDoctors.map((doctor) => (
            <Card
              key={doctor.id}
              className="group relative overflow-hidden glass-card rounded-3xl border-0 bg-card/60"
            >
              {/* Gradient border effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <CardContent className="p-8 relative z-10">
                <div className="mb-6 flex items-start justify-between">
                  <div className="relative">
                    <Avatar className="h-20 w-20 border-4 border-background shadow-xl transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-1">
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-xl font-bold text-primary">
                        {getInitials(doctor.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    {doctor.isOnline && (
                      <div className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-background bg-green-500 shadow-sm" />
                    )}
                  </div>
                  {doctor.isVerified && (
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary border-0 shadow-sm"
                    >
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Terverifikasi
                    </Badge>
                  )}
                </div>

                <div className="mb-6 space-y-1.5">
                  <h3 className="font-bold text-xl text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {doctor.user.name}
                  </h3>
                  <p className="font-medium text-primary/80">{doctor.specialization}</p>
                </div>

                <div className="mb-6 space-y-3 text-sm text-muted-foreground bg-background/50 rounded-2xl p-4 shadow-inner">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="truncate">{doctor.hospital}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{doctor.experience} tahun pengalaman</span>
                  </div>
                </div>

                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 bg-yellow-400/10 px-2.5 py-1 rounded-full">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-500" />
                    <span className="font-bold text-foreground">
                      {doctor.rating}
                    </span>
                    <span className="text-sm text-muted-foreground font-medium">
                      ({doctor.reviewCount})
                    </span>
                  </div>
                  <span className="font-bold text-lg text-primary">
                    {formatPrice(doctor.price)}
                  </span>
                </div>

                <Button className="w-full rounded-xl h-12 shadow-md transition-all duration-300 hover:shadow-lg group-hover:bg-primary group-hover:text-primary-foreground" asChild>
                  <AuthLink href={`/doctors/${doctor.id}`}>Buat Janji</AuthLink>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
