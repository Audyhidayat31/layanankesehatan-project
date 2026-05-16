'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Video, Pill, FileText, ArrowRight } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                Platform Kesehatan #1 Indonesia
              </span>
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance">
                Kesehatan Anda, <span className="text-primary">Prioritas Kami</span>
              </h1>
              <p className="max-w-lg text-lg text-muted-foreground text-pretty">
                Konsultasi dengan dokter terpercaya kapan saja, di mana saja. Dapatkan resep dan obat langsung dari apotek terverifikasi.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari dokter, spesialis, atau gejala..."
                  className="h-12 pl-10 pr-4"
                />
              </div>
              <Button size="lg" className="h-12 px-6">
                Cari Sekarang
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="group flex flex-col items-center gap-2 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/50 cursor-pointer">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                  <Video className="h-6 w-6 text-primary transition-colors duration-300 group-hover:text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground transition-colors duration-300 group-hover:text-primary">Konsultasi Online</span>
              </div>
              <div className="group flex flex-col items-center gap-2 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-accent/50 cursor-pointer">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 transition-transform duration-300 group-hover:scale-110 group-hover:bg-accent/20">
                  <Pill className="h-6 w-6 text-accent transition-colors duration-300 group-hover:text-accent" />
                </div>
                <span className="text-sm font-medium text-foreground transition-colors duration-300 group-hover:text-accent">Beli Obat</span>
              </div>
              <div className="group flex flex-col items-center gap-2 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-chart-3/50 cursor-pointer">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-chart-3/10 transition-transform duration-300 group-hover:scale-110 group-hover:bg-chart-3/20">
                  <FileText className="h-6 w-6 text-chart-3 transition-colors duration-300 group-hover:text-chart-3" />
                </div>
                <span className="text-sm font-medium text-foreground transition-colors duration-300 group-hover:text-chart-3">Rekam Medis</span>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative mx-auto aspect-square max-w-md">
              <div className="absolute inset-0 rounded-full bg-primary/10" />
              <div className="absolute inset-4 rounded-full bg-primary/5" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 p-8">
                  <div className="group rounded-2xl border border-border/40 bg-card/60 backdrop-blur-md p-6 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:bg-card hover:border-primary/30 cursor-default">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                      <span className="text-2xl font-bold text-primary">4K+</span>
                    </div>
                    <p className="text-sm font-medium text-foreground">Dokter Aktif</p>
                    <p className="text-xs text-muted-foreground">Terverifikasi</p>
                  </div>
                  <div className="mt-8 group rounded-2xl border border-border/40 bg-card/60 backdrop-blur-md p-6 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:bg-card hover:border-accent/30 cursor-default">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
                      <span className="text-2xl font-bold text-accent">1M+</span>
                    </div>
                    <p className="text-sm font-medium text-foreground">Pasien</p>
                    <p className="text-xs text-muted-foreground">Terlayani</p>
                  </div>
                  <div className="group rounded-2xl border border-border/40 bg-card/60 backdrop-blur-md p-6 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:bg-card hover:border-chart-3/30 cursor-default">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-chart-3/10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                      <span className="text-2xl font-bold text-chart-3">500+</span>
                    </div>
                    <p className="text-sm font-medium text-foreground">Apotek</p>
                    <p className="text-xs text-muted-foreground">Partner</p>
                  </div>
                  <div className="mt-8 group rounded-2xl border border-border/40 bg-card/60 backdrop-blur-md p-6 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:bg-card hover:border-chart-4/30 cursor-default">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-chart-4/10 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
                      <span className="text-2xl font-bold text-chart-4">24/7</span>
                    </div>
                    <p className="text-sm font-medium text-foreground">Layanan</p>
                    <p className="text-xs text-muted-foreground">Non-stop</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
