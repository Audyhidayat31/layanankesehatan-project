import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// GET /api/users?ids=id1,id2,id3
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const ids = searchParams.get('ids')

    let users;

    if (ids) {
      const idList = ids.split(',').filter(Boolean)
      users = await prisma.user.findMany({
        where: { id: { in: idList } },
        select: { id: true, name: true, email: true, role: true, createdAt: true, doctorProfile: true }
      })
    } else {
      users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true, createdAt: true, doctorProfile: true },
        orderBy: { createdAt: 'desc' }
      })
    }

    return NextResponse.json({ success: true, users })
  } catch (error) {
    console.error('Fetch users error:', error)
    return NextResponse.json({ error: 'Gagal mengambil data user' }, { status: 500 })
  }
}

// POST /api/users
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, role, specialization, hospital, experience, price } = body

    if (!name || !email || !role) {
      return NextResponse.json({ error: 'Nama, email, dan role wajib diisi' }, { status: 400 })
    }

    // Cek apakah email sudah digunakan
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 400 })
    }

    // Default password 'password123'
    const hashedPassword = await bcrypt.hash('password123', 10)

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          role,
          password: hashedPassword
        },
        select: { id: true, name: true, email: true, role: true, createdAt: true }
      })

      if (role === 'DOCTOR') {
        await tx.doctorProfile.create({
          data: {
            userId: user.id,
            specialization: specialization || 'Umum',
            hospital: hospital || 'Belum ditentukan',
            experience: Number(experience) || 0,
            price: Number(price) || 50000,
            isVerified: true
          }
        })
      }

      return user
    })

    return NextResponse.json({ success: true, user: result })
  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json({ error: 'Gagal membuat user' }, { status: 500 })
  }
}
