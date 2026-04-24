'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { Stethoscope, Mail, Lock, User, AlertCircle, Phone } from 'lucide-react'
import { useAuthStore } from '@/lib/store'

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const roleParam = searchParams.get('role')
  const { register } = useAuthStore()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: roleParam || 'patient',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak cocok')
      return
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter')
      return
    }

    setIsLoading(true)

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      })

      if (result.success) {
        switch (formData.role) {
          case 'patient':
            router.push('/patient/dashboard')
            break
          case 'doctor':
            router.push('/doctor/dashboard')
            break
          case 'pharmacy':
            router.push('/pharmacy/dashboard')
            break
          default:
            router.push('/')
        }
      } else {
        setError(result.error || 'Registrasi gagal')
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  const roles = [
    { value: 'patient', label: 'Pasien', description: 'Cari dokter dan pesan obat' },
    { value: 'doctor', label: 'Dokter', description: 'Layani pasien secara online' },
    { value: 'pharmacy', label: 'Apotek', description: 'Jual obat dan layanan kesehatan' },
  ]

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Buat Akun Baru</CardTitle>
        <CardDescription>
          Daftar untuk mulai menggunakan layanan MedCare
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            {roles.map((role) => (
              <button
                key={role.value}
                type="button"
                onClick={() => setFormData({ ...formData, role: role.value })}
                className={`rounded-lg border p-3 text-center transition-colors ${
                  formData.role === role.value
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <span className="block text-sm font-medium">{role.label}</span>
              </button>
            ))}
          </div>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Nama Lengkap</FieldLabel>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </Field>

            <Field>
              <FieldLabel htmlFor="phone">Nomor Telepon</FieldLabel>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+62812345678"
                  value={formData.phone}
                  onChange={handleChange}
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
                  name="password"
                  type="password"
                  placeholder="Minimal 6 karakter"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </Field>

            <Field>
              <FieldLabel htmlFor="confirmPassword">Konfirmasi Password</FieldLabel>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Ulangi password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </Field>
          </FieldGroup>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 rounded border-border"
              required
            />
            <label htmlFor="terms" className="text-sm text-muted-foreground">
              Saya menyetujui{' '}
              <Link href="/terms" className="text-primary hover:underline">
                Syarat & Ketentuan
              </Link>{' '}
              dan{' '}
              <Link href="/privacy" className="text-primary hover:underline">
                Kebijakan Privasi
              </Link>
            </label>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Memproses...
              </>
            ) : (
              'Daftar'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Sudah punya akun?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Masuk di sini
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/50 px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Stethoscope className="h-6 w-6 text-primary-foreground" />
        </div>
        <span className="text-2xl font-bold text-foreground">MedCare</span>
      </Link>

      <Suspense fallback={<div className="flex items-center justify-center"><Spinner className="h-8 w-8" /></div>}>
        <RegisterForm />
      </Suspense>
    </div>
  )
}
