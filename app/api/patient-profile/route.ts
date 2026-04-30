import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/patient-profile?userId=xxx
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId diperlukan' }, { status: 400 })
    }

    let patientProfile = await prisma.patientProfile.findUnique({
      where: { userId },
      include: { user: { select: { id: true, name: true, email: true, role: true } } }
    })

    // Jika belum ada, buat otomatis (auto-provision)
    if (!patientProfile) {
      const user = await prisma.user.findUnique({ where: { id: userId } })
      if (!user) {
        return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 })
      }
      patientProfile = await prisma.patientProfile.create({
        data: { userId },
        include: { user: { select: { id: true, name: true, email: true, role: true } } }
      })
    }

    return NextResponse.json({ success: true, patientProfile })
  } catch (error) {
    console.error('Fetch patient profile error:', error)
    return NextResponse.json({ error: 'Gagal mengambil profil pasien' }, { status: 500 })
  }
}
