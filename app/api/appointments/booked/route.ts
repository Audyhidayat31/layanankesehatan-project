import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const doctorId = searchParams.get('doctorId')
    const date = searchParams.get('date')

    if (!doctorId || !date) {
      return NextResponse.json({ error: 'doctorId dan date diperlukan' }, { status: 400 })
    }

    const [year, month, day] = date.split('-').map(Number)
    const startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0))
    const endOfDay = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999))

    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        date: {
          gte: startOfDay,
          lte: endOfDay
        },
        status: {
          not: 'CANCELLED'
        }
      },
      select: {
        time: true
      }
    })

    const bookedSlots = appointments.map(apt => apt.time)

    return NextResponse.json({
      success: true,
      bookedSlots
    })
  } catch (error) {
    console.error('Fetch booked slots error:', error)
    return NextResponse.json({ error: 'Gagal mengambil data jadwal yang sudah dibooking' }, { status: 500 })
  }
}
