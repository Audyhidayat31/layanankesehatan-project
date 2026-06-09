import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/doctors/[id]/timeslots
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const doctorId = resolvedParams.id
    const { searchParams } = new URL(req.url)
    const dateStr = searchParams.get('date')

    if (!doctorId || !dateStr) {
      return NextResponse.json({ error: 'doctorId dan date diperlukan' }, { status: 400 })
    }

    const [year, month, day] = dateStr.split('-').map(Number)
    const startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0))
    const endOfDay = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999))

    const timeslots = await prisma.timeSlot.findMany({
      where: {
        doctorId,
        date: {
          gte: startOfDay,
          lte: endOfDay
        },
        isActive: true, // Only fetch active slots
      },
      orderBy: [
        { startTime: 'asc' },
      ],
    })

    return NextResponse.json({ success: true, timeslots })
  } catch (error) {
    console.error('Fetch doctor timeslots error:', error)
    return NextResponse.json({ error: 'Gagal mengambil jadwal dokter' }, { status: 500 })
  }
}
