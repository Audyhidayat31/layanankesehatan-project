'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/lib/store'
import { useState, useEffect } from 'react'
import {
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

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
}

interface SidebarProps {
  role: 'patient' | 'doctor' | 'pharmacy' | 'admin'
}

const navItems: Record<string, NavItem[]> = {
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
    { label: 'Apotek', href: '/admin/pharmacies', icon: Pill },
    { label: 'Verifikasi', href: '/admin/verification', icon: ShieldCheck },
    { label: 'Transaksi', href: '/admin/transactions', icon: CreditCard },
    { label: 'Laporan', href: '/admin/reports', icon: BarChart3 },
  ],
}

export function DashboardSidebar({ role }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { logout, user } = useAuthStore()
  const [mounted, setMounted] = useState(false)
  const items = navItems[role] || []

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-sidebar-border bg-sidebar lg:block" />
  }

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-sidebar-border bg-sidebar lg:block">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
              <Stethoscope className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-sidebar-foreground">HealthServices</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <nav className="space-y-1">
            {items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="border-t border-sidebar-border p-3">
          <div className="mb-3 rounded-lg bg-sidebar-accent/50 p-3">
            <p className="text-sm font-medium text-sidebar-foreground">{user?.name}</p>
            <p className="text-xs text-sidebar-foreground/70">{user?.email}</p>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-destructive"
            onClick={() => {
              logout()
              router.push('/login')
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Keluar
          </Button>
        </div>
      </div>
    </aside>
  )
}
