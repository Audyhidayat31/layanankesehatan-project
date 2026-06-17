import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const pharmacies = await prisma.pharmacyProfile.findMany({
      include: {
        user: { select: { email: true } }
      },
      orderBy: { id: 'desc' }
    })
    return NextResponse.json({ success: true, pharmacies })
  } catch (error) {
    console.error('Fetch pharmacies error:', error)
    return NextResponse.json({ error: 'Gagal mengambil data apotek' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, address, city, phone, operatingHours, isVerified } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'Nama dan email wajib diisi' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 400 })
    }

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          role: 'PHARMACY',
          password: 'password123'
        }
      })

      const pharmacy = await tx.pharmacyProfile.create({
        data: {
          userId: user.id,
          name,
          address: address || '',
          city: city || '',
          phone: phone || '',
          operatingHours: operatingHours || '08:00 - 22:00',
          isVerified: isVerified || false
        },
        include: { user: { select: { email: true } } }
      })

      return pharmacy
    })

    return NextResponse.json({ success: true, pharmacy: result })
  } catch (error) {
    console.error('Create pharmacy error:', error)
    return NextResponse.json({ error: 'Gagal membuat apotek' }, { status: 500 })
  }
}
