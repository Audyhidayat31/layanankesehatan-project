import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// PUT /api/users/[id]
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const body = await req.json()
    const { name, email, role, password, specialization, hospital, experience, price } = body

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if email is taken by another user
    if (email && email !== existingUser.email) {
      const emailTaken = await prisma.user.findUnique({
        where: { email }
      })
      if (emailTaken) {
        return NextResponse.json({ error: 'Email already registered by another user' }, { status: 400 })
      }
    }

    const updateData: any = {
      ...(name && { name }),
      ...(email && { email }),
      ...(role && { role })
    }

    if (password) {
      updateData.password = password
    }

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id },
        data: updateData,
        select: { id: true, name: true, email: true, role: true, createdAt: true }
      })

      if (user.role === 'DOCTOR') {
        const existingProfile = await tx.doctorProfile.findUnique({
          where: { userId: id }
        })
        if (!existingProfile) {
          await tx.doctorProfile.create({
            data: {
              userId: id,
              specialization: specialization || 'Umum',
              hospital: hospital || 'Belum ditentukan',
              experience: Number(experience) || 0,
              price: Number(price) || 50000,
              isVerified: true
            }
          })
        } else {
          await tx.doctorProfile.update({
            where: { userId: id },
            data: {
              ...(specialization && { specialization }),
              ...(hospital && { hospital }),
              ...(experience !== undefined && { experience: Number(experience) }),
              ...(price !== undefined && { price: Number(price) }),
            }
          })
        }
      }

      return user
    })

    return NextResponse.json({ success: true, user: result })
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

// DELETE /api/users/[id]
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    await prisma.user.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'User deleted successfully' })
  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}
