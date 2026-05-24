import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/doctor-profile?userId=xxx
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId diperlukan' }, { status: 400 })
    }

    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId },
      include: {
        user: { select: { id: true, name: true, email: true, role: true, avatar: true, phone: true } },
        availableSlots: true,
      }
    })

    if (!doctorProfile) {
      return NextResponse.json({ error: 'Profil dokter tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json({ success: true, doctorProfile })
  } catch (error) {
    console.error('Fetch doctor profile error:', error)
    return NextResponse.json({ error: 'Gagal mengambil profil dokter' }, { status: 500 })
  }
}
