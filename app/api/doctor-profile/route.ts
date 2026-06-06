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

// PATCH /api/doctor-profile
export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { doctorId, rating, specialization, hospital, experience, price, bio, education, practiceAddress } = body

    if (!doctorId) {
      return NextResponse.json({ error: 'doctorId diperlukan' }, { status: 400 })
    }

    const existing = await prisma.doctorProfile.findUnique({ where: { id: doctorId } })
    if (!existing) {
      return NextResponse.json({ error: 'Profil dokter tidak ditemukan' }, { status: 404 })
    }

    const updateData: any = {}
    
    if (rating !== undefined && rating !== null) {
      const newCount = existing.reviewCount + 1
      const newRating = (existing.rating * existing.reviewCount + Number(rating)) / newCount
      updateData.rating = Number(newRating.toFixed(1))
      updateData.reviewCount = newCount
    }

    if (specialization !== undefined) updateData.specialization = specialization
    if (hospital !== undefined) updateData.hospital = hospital
    if (experience !== undefined) updateData.experience = Number(experience)
    if (price !== undefined) updateData.price = Number(price)
    if (bio !== undefined) updateData.bio = bio
    if (education !== undefined) updateData.education = education
    if (practiceAddress !== undefined) updateData.practiceAddress = practiceAddress

    const updated = await prisma.doctorProfile.update({
      where: { id: doctorId },
      data: updateData,
      include: {
        user: { select: { id: true, name: true, email: true, role: true, avatar: true, phone: true } },
        availableSlots: true,
      }
    })

    return NextResponse.json({ success: true, doctorProfile: updated })
  } catch (error) {
    console.error('Update doctor profile error:', error)
    return NextResponse.json({ error: 'Gagal memperbarui profil dokter' }, { status: 500 })
  }
}
