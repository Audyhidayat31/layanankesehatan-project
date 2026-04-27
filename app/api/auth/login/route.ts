import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    
    if (!user || user.password !== password) {
      return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 })
    }

    const mappedRole = user.role === 'DOCTOR' ? 'doctor' : user.role === 'PHARMACY' ? 'pharmacy' : user.role === 'ADMIN' ? 'admin' : 'patient'

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: mappedRole,
        password: user.password,
        createdAt: user.createdAt.toISOString()
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan pada server database' }, { status: 500 })
  }
}
