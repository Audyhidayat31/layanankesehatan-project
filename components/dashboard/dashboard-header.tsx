'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useAuthStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import {
  Menu,
  Bell,
  Search,
  Home,
  Stethoscope,
  LayoutDashboard,
  Calendar,
  MessageSquare,
  Pill,
  FileText,
  Settings,
  LogOut,
  Users,
  ClipboardList,
  Package,
  BarChart3,
  ShieldCheck,
  Clock,
  CreditCard,
} from 'lucide-react'

interface DashboardHeaderProps {
  role: 'patient' | 'doctor' | 'pharmacy' | 'admin'
}

const navItems: Record<string, { label: string; href: string; icon: React.ElementType }[]> = {
  patient: [
    { label: 'Dashboard', href: '/patient/dashboard', icon: LayoutDashboard },
    { label: 'Konsultasi', href: '/patient/appointments', icon: Calendar },
    { label: 'Pesan', href: '/patient/chat', icon: MessageSquare },
    { label: 'Pesanan Obat', href: '/patient/orders', icon: Pill },
    { label: 'Rekam Medis', href: '/patient/records', icon: FileText },
    { label: 'Transaksi', href: '/patient/transactions', icon: CreditCard },
    { label: 'Pengaturan', href: '/patient/settings', icon: Settings },
  ],
  doctor: [
    { label: 'Dashboard', href: '/doctor/dashboard', icon: LayoutDashboard },
    { label: 'Jadwal Praktik', href: '/doctor/schedule', icon: Clock },
    { label: 'Konsultasi', href: '/doctor/appointments', icon: Calendar },
    { label: 'Pasien', href: '/doctor/patients', icon: Users },
    { label: 'Pesan', href: '/doctor/chat', icon: MessageSquare },
    { label: 'Pengaturan', href: '/doctor/settings', icon: Settings },
  ],
  pharmacy: [
    { label: 'Dashboard', href: '/pharmacy/dashboard', icon: LayoutDashboard },
    { label: 'Produk', href: '/pharmacy/products', icon: Pill },
    { label: 'Pesanan', href: '/pharmacy/orders', icon: Package },
    { label: 'Stok', href: '/pharmacy/inventory', icon: ClipboardList },
    { label: 'Laporan', href: '/pharmacy/reports', icon: BarChart3 },
    { label: 'Pengaturan', href: '/pharmacy/settings', icon: Settings },
  ],
  admin: [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Pengguna', href: '/admin/users', icon: Users },
    { label: 'Dokter', href: '/admin/doctors', icon: Stethoscope },
    { label: 'Apotek', href: '/admin/pharmacies', icon: Pill },
    { label: 'Verifikasi', href: '/admin/verification', icon: ShieldCheck },
    { label: 'Transaksi', href: '/admin/transactions', icon: CreditCard },
    { label: 'Laporan', href: '/admin/reports', icon: BarChart3 },
  ],
}

export function DashboardHeader({ role }: DashboardHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const items = navItems[role] || []

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:pl-[272px]" />
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
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:pl-[272px]">
      <div className="flex items-center gap-4">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="flex h-16 items-center border-b border-border px-6">
              <SheetTitle className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Stethoscope className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold">HealthServices</span>
              </SheetTitle>
            </SheetHeader>
            <nav className="space-y-1 p-3">
              {items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSheetOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                )
              })}
              <hr className="my-3 border-border" />
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-destructive"
                onClick={() => {
                  logout()
                  setSheetOpen(false)
                  router.push('/login')
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Keluar
              </Button>
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/" className="flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Stethoscope className="h-4 w-4 text-primary-foreground" />
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <Home className="h-5 w-5" />
          </Link>
        </Button>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
            3
          </span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-xs text-primary-foreground">
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
              <Link href={`/${role}/settings`}>
                <Settings className="mr-2 h-4 w-4" />
                Pengaturan
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                logout()
                router.push('/login')
              }}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
