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
        select: { id: true, name: true, email: true, role: true, createdAt: true }
      })
    } else {
      users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true, createdAt: true },
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
    const { name, email, role } = body

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

    const user = await prisma.user.create({
      data: {
        name,
        email,
        role,
        password: hashedPassword
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    })

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json({ error: 'Gagal membuat user' }, { status: 500 })
  }
}
