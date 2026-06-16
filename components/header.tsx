'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuthStore, useCartStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Menu,
  X,
  ShoppingCart,
  Bell,
  User,
  LogOut,
  Settings,
  Calendar,
  LayoutDashboard,
  Stethoscope,
  Pill,
} from 'lucide-react'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, isAuthenticated, logout } = useAuthStore()
  const { items } = useCartStore()

  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const getDashboardLink = () => {
    if (!user) return '/login'
    switch (user.role) {
      case 'patient':
        return '/patient/dashboard'
      case 'doctor':
        return '/doctor/dashboard'
      case 'pharmacy':
        return '/pharmacy/dashboard'
      case 'admin':
        return '/admin/dashboard'
      default:
        return '/login'
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 border-b ${scrolled
          ? 'bg-background/70 backdrop-blur-2xl border-border/50 shadow-sm py-2'
          : 'bg-background/40 backdrop-blur-md border-transparent py-4'
        }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center gap-10">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-md transition-transform duration-500 group-hover:scale-105 group-hover:rotate-6">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-foreground">
              Med<span className="text-primary">Connect</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/doctors"
              className="text-sm font-semibold text-muted-foreground transition-colors hover:text-primary relative after:absolute after:-bottom-1.5 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
            >
              Cari Dokter
            </Link>
            <Link
              href="/pharmacy"
              className="text-sm font-semibold text-muted-foreground transition-colors hover:text-primary relative after:absolute after:-bottom-1.5 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
            >
              Apotek
            </Link>
            <Link
              href="/articles"
              className="text-sm font-semibold text-muted-foreground transition-colors hover:text-primary relative after:absolute after:-bottom-1.5 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
            >
              Artikel Kesehatan
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && user?.role === 'patient' && (
            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 hover:text-primary rounded-full transition-colors">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs bg-primary shadow-sm border-2 border-background">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>
          )}

          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="icon" className="relative hidden md:flex hover:bg-primary/10 hover:text-primary rounded-full transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 flex h-2 w-2 rounded-full bg-destructive" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-3 rounded-full hover:bg-muted/50 border border-transparent hover:border-border/50 transition-all">
                    <Avatar className="h-8 w-8 border border-border shadow-sm">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-xs font-bold">
                        {user ? getInitials(user.name) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden text-sm font-semibold md:block">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60 rounded-2xl p-2">
                  <div className="px-3 py-2.5 bg-muted/50 rounded-xl mb-2">
                    <p className="text-sm font-bold">{user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                    <Link href={getDashboardLink()} className="flex items-center gap-2 py-2">
                      <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {user?.role === 'patient' && (
                    <>
                      <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                        <Link href="/patient/appointments" className="flex items-center gap-2 py-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          Konsultasi Saya
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                        <Link href="/patient/orders" className="flex items-center gap-2 py-2">
                          <Pill className="h-4 w-4 text-muted-foreground" />
                          Pesanan Obat
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                    <Link href="/settings" className="flex items-center gap-2 py-2">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      Pengaturan
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem
                    onClick={() => logout()}
                    className="flex items-center gap-2 py-2 text-destructive focus:text-destructive focus:bg-destructive/10 rounded-lg cursor-pointer font-medium"
                  >
                    <LogOut className="h-4 w-4" />
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden items-center gap-3 md:flex">
              <Button variant="ghost" className="font-semibold rounded-full hover:bg-primary/10 hover:text-primary transition-colors" asChild>
                <Link href="/login">Masuk</Link>
              </Button>
              <Button className="font-semibold rounded-full shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5" asChild>
                <Link href="/register">Daftar Sekarang</Link>
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-xl border-b border-border shadow-lg transition-all duration-300 overflow-hidden ${mobileMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <nav className="container mx-auto flex flex-col gap-1 px-4 py-4">
          <Link
            href="/doctors"
            className="rounded-xl px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted/50 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Cari Dokter
          </Link>
          <Link
            href="/pharmacy"
            className="rounded-xl px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted/50 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Apotek
          </Link>
          <Link
            href="/articles"
            className="rounded-xl px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted/50 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Artikel Kesehatan
          </Link>
          {!isAuthenticated && (
            <div className="mt-4 pt-4 border-t border-border flex flex-col gap-2">
              <Link
                href="/login"
                className="rounded-xl px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted/50 transition-colors text-center border border-border"
                onClick={() => setMobileMenuOpen(false)}
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground shadow-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Daftar Sekarang
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
