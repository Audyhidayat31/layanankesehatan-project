'use client'

import Link from 'next/link'
import { useState } from 'react'
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
  const { user, isAuthenticated, logout } = useAuthStore()
  const { items } = useCartStore()

  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0)

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
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm transition-all duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 transition-all duration-300 group-hover:bg-primary group-hover:shadow-md">
              <Stethoscope className="h-5 w-5 text-primary transition-colors duration-300 group-hover:text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">HealthServices</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/doctors"
              className="text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-primary hover:-translate-y-0.5 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              Cari Dokter
            </Link>
            <Link
              href="/pharmacy"
              className="text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-primary hover:-translate-y-0.5 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              Apotek
            </Link>
            <Link
              href="/articles"
              className="text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-primary hover:-translate-y-0.5 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              Artikel Kesehatan
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated && user?.role === 'patient' && (
            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>
          )}

          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="icon" className="relative hidden md:flex">
                <Bell className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 flex h-2 w-2 rounded-full bg-destructive" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {user ? getInitials(user.name) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden text-sm font-medium md:block">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={getDashboardLink()} className="flex items-center gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {user?.role === 'patient' && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/patient/appointments" className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Konsultasi Saya
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/patient/orders" className="flex items-center gap-2">
                          <Pill className="h-4 w-4" />
                          Pesanan Obat
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Pengaturan
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => logout()}
                    className="flex items-center gap-2 text-destructive focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden items-center gap-3 md:flex">
              <Button variant="ghost" className="transition-all duration-300 hover:bg-primary/10 hover:text-primary" asChild>
                <Link href="/login">Masuk</Link>
              </Button>
              <Button className="transition-all duration-300 hover:shadow-md hover:-translate-y-0.5" asChild>
                <Link href="/register">Daftar</Link>
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border bg-card md:hidden">
          <nav className="container mx-auto flex flex-col gap-2 px-4 py-4">
            <Link
              href="/doctors"
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              Cari Dokter
            </Link>
            <Link
              href="/pharmacy"
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              Apotek
            </Link>
            <Link
              href="/articles"
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              Artikel Kesehatan
            </Link>
            {!isAuthenticated && (
              <>
                <hr className="my-2 border-border" />
                <Link
                  href="/login"
                  className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="rounded-md bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Daftar
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
