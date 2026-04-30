import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/users?ids=id1,id2,id3
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const ids = searchParams.get('ids')

    if (!ids) {
      return NextResponse.json({ error: 'Parameter ids tidak ada' }, { status: 400 })
    }

    const idList = ids.split(',').filter(Boolean)

    const users = await prisma.user.findMany({
      where: { id: { in: idList } },
      select: { id: true, name: true, email: true, role: true }
    })

    return NextResponse.json({ success: true, users })
  } catch (error) {
    console.error('Fetch users error:', error)
    return NextResponse.json({ error: 'Gagal mengambil data user' }, { status: 500 })
  }
}
