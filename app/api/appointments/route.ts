import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const role = searchParams.get('role')

    if (!userId || !role) {
      return NextResponse.json({ error: 'User ID dan role diperlukan' }, { status: 400 })
    }

    let appointments = []

    if (role === 'doctor') {
      const doctorProfile = await prisma.doctorProfile.findUnique({
        where: { userId }
      })
      if (doctorProfile) {
        appointments = await prisma.appointment.findMany({
          where: { doctorId: doctorProfile.id },
          include: {
            patient: { include: { user: true } },
            doctor: { include: { user: true } }
          },
          orderBy: { createdAt: 'desc' }
        })
      }
    } else if (role === 'patient') {
      const patientProfile = await prisma.patientProfile.findUnique({
        where: { userId }
      })
      if (patientProfile) {
        appointments = await prisma.appointment.findMany({
          where: { patientId: patientProfile.id },
          include: {
            patient: { include: { user: true } },
            doctor: { include: { user: true } }
          },
          orderBy: { createdAt: 'desc' }
        })
      }
    }

    // Map Prisma uppercase back to lowercase for frontend compatibility
    const formattedAppointments = appointments.map((apt: any) => {
      // safely format date back to YYYY-MM-DD
      const dateObj = new Date(apt.date);
      const formattedDate = !isNaN(dateObj.getTime()) 
        ? dateObj.toISOString().split('T')[0] 
        : apt.date;

      return {
        ...apt,
        date: formattedDate,
        status: apt.status.toLowerCase(),
        type: apt.type.toLowerCase(),
      };
    })

    return NextResponse.json({
      success: true,
      appointments: formattedAppointments
    })
  } catch (error) {
    console.error('Fetch appointments error:', error)
    return NextResponse.json({ error: 'Gagal mengambil data konsultasi' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { patientId, doctorId, date, time, type, complaint } = body

    const newAppointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        date: new Date(date),
        time,
        type: type.toUpperCase(),
        complaint,
        status: 'PENDING'
      },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } }
      }
    })

    const dateObj = new Date(newAppointment.date);
    const formattedDate = !isNaN(dateObj.getTime()) 
      ? dateObj.toISOString().split('T')[0] 
      : newAppointment.date;

    return NextResponse.json({
      success: true,
      appointment: {
        ...newAppointment,
        date: formattedDate,
        status: newAppointment.status.toLowerCase(),
        type: newAppointment.type.toLowerCase()
      }
    })
  } catch (error) {
    console.error('Create appointment error:', error)
    return NextResponse.json({ error: 'Gagal membuat janji temu' }, { status: 500 })
  }
}
