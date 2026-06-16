import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const doctors = await prisma.doctorProfile.findMany({
      where: {
        user: {
          role: 'DOCTOR'
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            phone: true,
          }
        },
        availableSlots: true
      }
    })
    return NextResponse.json({ success: true, doctors })
  } catch (error) {
    console.error('Fetch doctors error:', error)
    return NextResponse.json({ error: 'Gagal mengambil data dokter' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { name, specialization, hospital, experience, price, isVerified, email, password } = await req.json()

    if (!name || !specialization || !hospital || !email) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
    }

    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 400 })
    }

    // Create User and DoctorProfile in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: password || 'demo123',
          role: 'DOCTOR',
        }
      })

      const doctorProfile = await tx.doctorProfile.create({
        data: {
          userId: user.id,
          specialization,
          hospital,
          experience: Number(experience),
          price: Number(price),
          isVerified: isVerified || false,
        },
        include: {
          user: true
        }
      })

      return doctorProfile
    })

    return NextResponse.json({ success: true, doctor: result })
  } catch (error) {
    console.error('Create doctor error:', error)
    return NextResponse.json({ error: 'Gagal membuat akun dokter' }, { status: 500 })
  }
}
