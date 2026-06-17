import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const { name, address, city, phone, operatingHours, isVerified } = body

    const existingProfile = await prisma.pharmacyProfile.findUnique({
      where: { id },
      include: { user: true }
    })

    if (!existingProfile) {
      return NextResponse.json({ error: 'Apotek tidak ditemukan' }, { status: 404 })
    }

    const result = await prisma.$transaction(async (tx) => {
      // Update User name
      await tx.user.update({
        where: { id: existingProfile.userId },
        data: { name }
      })

      // Update PharmacyProfile
      const updated = await tx.pharmacyProfile.update({
        where: { id },
        data: {
          name,
          address,
          city,
          phone,
          operatingHours,
          isVerified
        },
        include: { user: { select: { email: true } } }
      })
      
      return updated
    })

    return NextResponse.json({ success: true, pharmacy: result })
  } catch (error) {
    console.error('Update pharmacy error:', error)
    return NextResponse.json({ error: 'Gagal mengupdate apotek' }, { status: 500 })
  }
}
