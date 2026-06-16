import Link from 'next/link'
import { Stethoscope, Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border/50 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-6">
            <Link href="/" className="group flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-md transition-transform duration-500 group-hover:scale-105 group-hover:rotate-6">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-foreground">
                Med<span className="text-primary">Connect</span>
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed">
              Platform kesehatan digital terpercaya untuk konsultasi dokter online, pembelian obat, dan layanan kesehatan lainnya. Cepat, aman, dan mudah.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-background border border-border text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:text-primary hover:shadow-md">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-background border border-border text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:text-primary hover:shadow-md">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-background border border-border text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:text-primary hover:shadow-md">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-background border border-border text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:text-primary hover:shadow-md">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="font-bold text-lg text-foreground">Layanan</h3>
            <nav className="flex flex-col gap-4">
              <Link href="/doctors" className="text-muted-foreground hover:text-primary transition-colors duration-300 hover:translate-x-1 font-medium inline-block w-fit">
                Konsultasi Dokter
              </Link>
              <Link href="/pharmacy" className="text-muted-foreground hover:text-primary transition-colors duration-300 hover:translate-x-1 font-medium inline-block w-fit">
                Apotek Online
              </Link>
              <Link href="/articles" className="text-muted-foreground hover:text-primary transition-colors duration-300 hover:translate-x-1 font-medium inline-block w-fit">
                Artikel Kesehatan
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 hover:translate-x-1 font-medium inline-block w-fit">
                Cek Gejala
              </Link>
            </nav>
          </div>

          <div className="space-y-6">
            <h3 className="font-bold text-lg text-foreground">Perusahaan</h3>
            <nav className="flex flex-col gap-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 hover:translate-x-1 font-medium inline-block w-fit">
                Tentang Kami
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 hover:translate-x-1 font-medium inline-block w-fit">
                Karir
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 hover:translate-x-1 font-medium inline-block w-fit">
                Blog
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 hover:translate-x-1 font-medium inline-block w-fit">
                Hubungi Kami
              </Link>
            </nav>
          </div>

          <div className="space-y-6">
            <h3 className="font-bold text-lg text-foreground">Informasi</h3>
            <nav className="flex flex-col gap-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 hover:translate-x-1 font-medium inline-block w-fit">
                Syarat & Ketentuan
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 hover:translate-x-1 font-medium inline-block w-fit">
                Kebijakan Privasi
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 hover:translate-x-1 font-medium inline-block w-fit">
                FAQ
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 hover:translate-x-1 font-medium inline-block w-fit">
                Bantuan
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border/50 flex flex-col items-center justify-between gap-6 md:flex-row">
          <p className="text-sm text-muted-foreground font-medium">
            &copy; {new Date().getFullYear()} MedConnect. Semua hak dilindungi.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground font-medium">Terdaftar di:</span>
            <div className="flex gap-2">
              <span className="rounded-md bg-background border border-border px-3 py-1.5 text-xs font-bold text-muted-foreground shadow-sm">
                BPOM RI
              </span>
              <span className="rounded-md bg-background border border-border px-3 py-1.5 text-xs font-bold text-muted-foreground shadow-sm">
                Kemenkes RI
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
