'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { Stethoscope, Mail, Lock, AlertCircle } from 'lucide-react'
import { useAuthStore } from '@/lib/store'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await login(email, password)
      if (result.success) {
        const user = useAuthStore.getState().user
        if (user) {
          switch (user.role) {
            case 'patient':
              router.push('/patient/dashboard')
              break
            case 'doctor':
              router.push('/doctor/dashboard')
              break
            case 'pharmacy':
              router.push('/pharmacy/dashboard')
              break
            case 'admin':
              router.push('/admin/dashboard')
              break
            default:
              router.push('/')
          }
        }
      } else {
        setError(result.error || 'Login gagal')
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/50 px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Stethoscope className="h-6 w-6 text-primary-foreground" />
        </div>
        <span className="text-2xl font-bold text-foreground">HealthServices</span>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Masuk ke Akun</CardTitle>
          <CardDescription>
            Masukkan email dan password Anda untuk melanjutkan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </Field>
            </FieldGroup>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded border-border" />
                <span className="text-muted-foreground">Ingat saya</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Lupa password?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Memproses...
                </>
              ) : (
                'Masuk'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Belum punya akun?{' '}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Daftar sekarang
            </Link>
          </div>

          <div className="mt-6 space-y-3">
            <p className="text-center text-xs text-muted-foreground">Demo accounts:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setEmail('ahmad@patient.com')
                  setPassword('demo')
                }}
                className="rounded border border-border p-2 hover:bg-muted"
              >
                Pasien
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('sarah@doctor.com')
                  setPassword('demo')
                }}
                className="rounded border border-border p-2 hover:bg-muted"
              >
                Dokter
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('sehat@pharmacy.com')
                  setPassword('demo')
                }}
                className="rounded border border-border p-2 hover:bg-muted"
              >
                Apotek
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@gmail.com')
                  setPassword('demo')
                }}
                className="rounded border border-border p-2 hover:bg-muted"
              >
                Admin
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
