import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json()

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 400 })
    }

    const userRole = role === 'doctor' ? 'DOCTOR' : role === 'pharmacy' ? 'PHARMACY' : role === 'admin' ? 'ADMIN' : 'PATIENT'

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        role: userRole,
      }
    })

    if (userRole === 'PATIENT') {
      await prisma.patientProfile.create({
        data: {
          userId: user.id
        }
      })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: role,
        password: user.password,
        createdAt: user.createdAt.toISOString()
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan pada server database' }, { status: 500 })
  }
}
