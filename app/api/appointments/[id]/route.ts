import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Next.js 15+: params is now a Promise, must be awaited
    const { id } = await context.params
    const body = await req.json()
    const { status, diagnosis, notes } = body

    if (!id) {
      return NextResponse.json({ error: 'ID tidak ditemukan' }, { status: 400 })
    }

    // Validate appointment exists
    const existing = await prisma.appointment.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ 
        success: false, 
        error: `Konsultasi dengan ID ${id} tidak ditemukan di database` 
      }, { status: 404 })
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        ...(status ? { status: status.toUpperCase() as any } : {}),
        ...(diagnosis !== undefined ? { diagnosis } : {}),
        ...(notes !== undefined ? { notes } : {}),
      },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
      }
    })

    // Format date back to YYYY-MM-DD
    const dateObj = new Date(updatedAppointment.date)
    const formattedDate = !isNaN(dateObj.getTime())
      ? dateObj.toISOString().split('T')[0]
      : String(updatedAppointment.date)

    const formattedAppointment = {
      ...updatedAppointment,
      date: formattedDate,
      status: updatedAppointment.status.toLowerCase(),
      type: updatedAppointment.type.toLowerCase(),
    }

    return NextResponse.json({
      success: true,
      appointment: formattedAppointment
    })
  } catch (error: any) {
    console.error('Update appointment error:', error?.message || error)
    return NextResponse.json(
      { error: 'Gagal memperbarui janji temu', detail: error?.message },
      { status: 500 }
    )
  }
}
