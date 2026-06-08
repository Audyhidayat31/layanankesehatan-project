import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Stethoscope, Store, ArrowRight } from 'lucide-react'

export function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden bg-primary">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent opacity-90" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
      
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-16 text-center max-w-3xl mx-auto slide-up-fade">
          <h2 className="mb-6 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            Tumbuh Bersama Kami
          </h2>
          <p className="text-xl text-primary-foreground/80 leading-relaxed font-medium">
            Bergabunglah dengan ekosistem kesehatan digital terbesar di Indonesia dan kembangkan layanan Anda.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto slide-up-fade stagger-1">
          <div className="group relative rounded-3xl bg-white/10 p-8 md:p-12 backdrop-blur-xl border border-white/20 transition-all duration-500 hover:-translate-y-2 hover:bg-white/15 hover:shadow-2xl hover:shadow-black/20 overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none">
              <Stethoscope className="w-48 h-48 text-white -rotate-12 translate-x-8 -translate-y-8" />
            </div>
            
            <div className="relative z-10">
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-4 text-3xl font-bold text-white">
                Bergabung sebagai Dokter
              </h3>
              <p className="mb-10 text-lg text-white/80 leading-relaxed">
                Perluas jangkauan praktik Anda dengan bergabung bersama ribuan dokter. Kelola jadwal dengan mudah dan bantu lebih banyak pasien di seluruh Indonesia.
              </p>
              <Button
                variant="secondary"
                size="lg"
                className="rounded-xl h-14 px-8 bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-lg group-hover:shadow-white/25"
                asChild
              >
                <Link href="/register?role=doctor" className="flex items-center gap-2 font-bold">
                  Daftar Sekarang
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="group relative rounded-3xl bg-white/10 p-8 md:p-12 backdrop-blur-xl border border-white/20 transition-all duration-500 hover:-translate-y-2 hover:bg-white/15 hover:shadow-2xl hover:shadow-black/20 overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none">
              <Store className="w-48 h-48 text-white rotate-12 translate-x-8 -translate-y-8" />
            </div>
            
            <div className="relative z-10">
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                <Store className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-4 text-3xl font-bold text-white">
                Daftarkan Apotek Anda
              </h3>
              <p className="mb-10 text-lg text-white/80 leading-relaxed">
                Jadikan apotek Anda bagian dari jaringan kesehatan digital terpercaya. Jangkau pelanggan lebih luas dan tingkatkan penjualan dengan mudah.
              </p>
              <Button
                variant="secondary"
                size="lg"
                className="rounded-xl h-14 px-8 bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-lg group-hover:shadow-white/25"
                asChild
              >
                <Link href="/register?role=pharmacy" className="flex items-center gap-2 font-bold">
                  Daftar Sekarang
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
