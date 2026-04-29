import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { status, diagnosis, notes } = await req.json()

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        status: status ? status.toUpperCase() : undefined,
        diagnosis,
        notes
      }
    })

    // Map Prisma uppercase back to lowercase for frontend compatibility
    const formattedAppointment = {
      ...updatedAppointment,
      status: updatedAppointment.status.toLowerCase(),
    }

    return NextResponse.json({
      success: true,
      appointment: formattedAppointment
    })
  } catch (error) {
    console.error('Update appointment error:', error)
    return NextResponse.json({ error: 'Gagal memperbarui janji temu' }, { status: 500 })
  }
}
