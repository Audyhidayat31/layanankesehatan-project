'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import { Spinner } from '@/components/ui/spinner'

export default function SettingsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (user) {
      switch (user.role) {
        case 'patient':
          router.push('/patient/settings')
          break
        case 'doctor':
          router.push('/doctor/settings')
          break
        case 'pharmacy':
          router.push('/pharmacy/settings')
          break
        case 'admin':
          router.push('/admin/dashboard') // Admin might not have a dedicated settings page yet
          break
        default:
          router.push('/')
      }
    }
  }, [user, isAuthenticated, router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Spinner className="mx-auto mb-4 h-8 w-8 text-primary" />
        <p className="text-muted-foreground">Mengalihkan ke pengaturan...</p>
      </div>
    </div>
  )
}
