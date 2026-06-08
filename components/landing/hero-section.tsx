'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Video, Pill, FileText, ArrowRight } from 'lucide-react'

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/doctors?search=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      router.push('/doctors')
    }
  }

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-mesh">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-accent/20 rounded-full blur-[128px] pointer-events-none" />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-10 slide-up-fade">
            <div className="space-y-6">
              <span className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-sm font-medium text-primary shadow-sm backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse-soft" />
                Platform Kesehatan #1 Indonesia
              </span>
              <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-6xl lg:text-7xl text-balance">
                Kesehatan Anda, <br />
                <span className="text-gradient">Prioritas Kami</span>
              </h1>
              <p className="max-w-lg text-lg text-muted-foreground text-pretty leading-relaxed">
                Konsultasi dengan dokter terpercaya kapan saja, di mana saja. Dapatkan resep dan obat langsung dari apotek terverifikasi dalam hitungan menit.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row max-w-xl">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch()
                    }
                  }}
                  placeholder="Cari dokter, spesialis, atau gejala..."
                  className="h-14 pl-12 pr-4 text-base rounded-2xl bg-background/50 backdrop-blur-sm border-border/50 focus-visible:ring-primary focus-visible:bg-background transition-all shadow-sm"
                />
              </div>
              <Button 
                onClick={handleSearch}
                size="lg" 
                className="h-14 px-8 rounded-2xl text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5"
              >
                Cari Sekarang
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-4">
              <div className="group flex flex-col items-center gap-3 rounded-2xl glass-card p-5 text-center cursor-pointer">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <Video className="h-7 w-7 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">Konsultasi<br/>Online</span>
              </div>
              <div className="group flex flex-col items-center gap-3 rounded-2xl glass-card p-5 text-center cursor-pointer stagger-1">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
                  <Pill className="h-7 w-7 text-accent" />
                </div>
                <span className="text-sm font-medium text-foreground">Beli<br/>Obat</span>
              </div>
              <div className="group flex flex-col items-center gap-3 rounded-2xl glass-card p-5 text-center cursor-pointer stagger-2">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-chart-3/10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <FileText className="h-7 w-7 text-chart-3" />
                </div>
                <span className="text-sm font-medium text-foreground">Rekam<br/>Medis</span>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block h-full min-h-[600px] slide-up-fade stagger-2">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Central glowing orb */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-tr from-primary/30 to-accent/30 rounded-full blur-[80px] animate-pulse-soft" />
              
              <div className="relative w-full max-w-lg aspect-square">
                {/* Floating Cards */}
                <div className="absolute top-[10%] left-[5%] animate-float-slow group rounded-3xl glass-panel p-6 shadow-2xl hover:scale-105 transition-transform duration-500 w-48">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20 backdrop-blur-md">
                    <span className="text-2xl font-bold text-primary">4K+</span>
                  </div>
                  <p className="text-base font-semibold text-foreground">Dokter Aktif</p>
                  <p className="text-sm text-muted-foreground mt-1">Terverifikasi</p>
                </div>
                
                <div className="absolute bottom-[20%] left-[15%] animate-float group rounded-3xl glass-panel p-6 shadow-2xl hover:scale-105 transition-transform duration-500 w-48" style={{ animationDelay: '1s' }}>
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/20 backdrop-blur-md">
                    <span className="text-2xl font-bold text-accent">1M+</span>
                  </div>
                  <p className="text-base font-semibold text-foreground">Pasien</p>
                  <p className="text-sm text-muted-foreground mt-1">Terlayani</p>
                </div>

                <div className="absolute top-[25%] right-[5%] animate-float-fast group rounded-3xl glass-panel p-6 shadow-2xl hover:scale-105 transition-transform duration-500 w-48" style={{ animationDelay: '2s' }}>
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-chart-3/20 backdrop-blur-md">
                    <span className="text-2xl font-bold text-chart-3">500+</span>
                  </div>
                  <p className="text-base font-semibold text-foreground">Apotek</p>
                  <p className="text-sm text-muted-foreground mt-1">Partner</p>
                </div>

                <div className="absolute bottom-[5%] right-[10%] animate-float-slow group rounded-3xl glass-panel p-6 shadow-2xl hover:scale-105 transition-transform duration-500 w-48" style={{ animationDelay: '3s' }}>
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-chart-4/20 backdrop-blur-md">
                    <span className="text-2xl font-bold text-chart-4">24/7</span>
                  </div>
                  <p className="text-base font-semibold text-foreground">Layanan</p>
                  <p className="text-sm text-muted-foreground mt-1">Non-stop</p>
                </div>
                
                {/* Decorative dots/circles in background */}
                <svg className="absolute inset-0 w-full h-full -z-10 opacity-20" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="1.5" fill="currentColor" className="text-foreground" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
