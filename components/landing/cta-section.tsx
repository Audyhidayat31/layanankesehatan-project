import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Stethoscope, Store } from 'lucide-react'

export function CTASection() {
  return (
    <section className="bg-primary py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="group rounded-2xl bg-primary-foreground/10 p-8 backdrop-blur-md md:p-10 transition-all duration-300 hover:-translate-y-2 hover:bg-primary-foreground/20 hover:shadow-2xl border border-primary-foreground/10 cursor-pointer">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary-foreground/20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
              <Stethoscope className="h-7 w-7 text-primary-foreground transition-transform duration-500 group-hover:-rotate-12" />
            </div>
            <h3 className="mb-3 text-2xl font-bold text-primary-foreground">
              Bergabung sebagai Dokter
            </h3>
            <p className="mb-6 text-primary-foreground/80">
              Perluas jangkauan praktik Anda dengan bergabung bersama ribuan dokter di platform HealthServices. Kelola jadwal dengan mudah dan bantu lebih banyak pasien.
            </p>
            <Button
              variant="secondary"
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              asChild
            >
              <Link href="/register?role=doctor">Daftar sebagai Dokter</Link>
            </Button>
          </div>

          <div className="group rounded-2xl bg-primary-foreground/10 p-8 backdrop-blur-md md:p-10 transition-all duration-300 hover:-translate-y-2 hover:bg-primary-foreground/20 hover:shadow-2xl border border-primary-foreground/10 cursor-pointer">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary-foreground/20 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-12">
              <Store className="h-7 w-7 text-primary-foreground transition-transform duration-500 group-hover:rotate-12" />
            </div>
            <h3 className="mb-3 text-2xl font-bold text-primary-foreground">
              Daftarkan Apotek Anda
            </h3>
            <p className="mb-6 text-primary-foreground/80">
              Jadikan apotek Anda bagian dari jaringan apotek digital terpercaya. Jangkau lebih banyak pelanggan dan tingkatkan penjualan dengan mudah.
            </p>
            <Button
              variant="secondary"
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              asChild
            >
              <Link href="/register?role=pharmacy">Daftar sebagai Apotek</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
