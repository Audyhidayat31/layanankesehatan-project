import Link from 'next/link'
import { Stethoscope, Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="group flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 transition-all duration-300 group-hover:bg-primary">
                <Stethoscope className="h-5 w-5 text-primary transition-colors duration-300 group-hover:text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">HealthServices</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Platform kesehatan digital terpercaya untuk konsultasi dokter online, pembelian obat, dan layanan kesehatan lainnya.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:text-primary">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Layanan</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/doctors" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 hover:translate-x-1">
                Konsultasi Dokter
              </Link>
              <Link href="/pharmacy" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 hover:translate-x-1">
                Apotek Online
              </Link>
              <Link href="/articles" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 hover:translate-x-1">
                Artikel Kesehatan
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 hover:translate-x-1">
                Cek Gejala
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Perusahaan</h3>
            <nav className="flex flex-col gap-2">
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 hover:translate-x-1">
                Tentang Kami
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 hover:translate-x-1">
                Karir
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 hover:translate-x-1">
                Blog
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 hover:translate-x-1">
                Hubungi Kami
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Informasi</h3>
            <nav className="flex flex-col gap-2">
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 hover:translate-x-1">
                Syarat & Ketentuan
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 hover:translate-x-1">
                Kebijakan Privasi
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 hover:translate-x-1">
                FAQ
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 hover:translate-x-1">
                Bantuan
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              2024 HealthServices. Semua hak dilindungi.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">Terdaftar di:</span>
              <span className="rounded bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                BPOM RI
              </span>
              <span className="rounded bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                Kemenkes RI
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
