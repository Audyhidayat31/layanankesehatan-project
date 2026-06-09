import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/doctor/timeslots?doctorId=xxx
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const doctorId = searchParams.get('doctorId')

    if (!doctorId) {
      return NextResponse.json({ error: 'doctorId diperlukan' }, { status: 400 })
    }

    const today = new Date()
    today.setDate(today.getDate() - 1) // Memberikan margin 1 hari untuk masalah timezone
    today.setHours(0, 0, 0, 0)

    const timeslots = await prisma.$queryRaw`
      SELECT id, "doctorId", date, "startTime", "endTime", "isBooked", "isActive"
      FROM "TimeSlot"
      WHERE "doctorId" = ${doctorId} AND date >= ${today}
      ORDER BY date ASC, "startTime" ASC
    `

    return NextResponse.json({
      success: true,
      timeslots
    })
  } catch (error) {
    console.error('Fetch timeslots error:', error)
    return NextResponse.json({ error: 'Gagal mengambil jadwal' }, { status: 500 })
  }
}

// POST /api/doctor/timeslots
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { doctorId, date, startTime, endTime } = body

    if (!doctorId || !date || !startTime || !endTime) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
    }

    const id = `cm${Math.random().toString(36).slice(2, 11)}` // fallback fake id just in case
    const dbDate = new Date(date)
    await prisma.$executeRaw`
      INSERT INTO "TimeSlot" (id, "doctorId", date, "startTime", "endTime", "isActive", "isBooked")
      VALUES (
        gen_random_uuid()::text,
        ${doctorId}, 
        ${dbDate}, 
        ${startTime}, 
        ${endTime}, 
        true, 
        false
      )
    `
    // Fetch it back to get the real generated id
    const result: any[] = await prisma.$queryRaw`
      SELECT * FROM "TimeSlot" WHERE "doctorId" = ${doctorId} AND date = ${dbDate} AND "startTime" = ${startTime} AND "endTime" = ${endTime} LIMIT 1
    `
    const timeslot = result[0] || { id, doctorId, date: dbDate, startTime, endTime, isActive: true, isBooked: false }

    return NextResponse.json({ success: true, timeslot: { ...timeslot, isActive: true } })
  } catch (error) {
    console.error('Create timeslot error:', error)
    return NextResponse.json({ error: 'Gagal membuat jadwal', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

// PUT /api/doctor/timeslots
export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { id, isActive } = body

    if (!id || isActive === undefined) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
    }

    await prisma.$executeRaw`
      UPDATE "TimeSlot" SET "isActive" = ${isActive} WHERE id = ${id}
    `
    const result: any[] = await prisma.$queryRaw`SELECT * FROM "TimeSlot" WHERE id = ${id} LIMIT 1`
    const timeslot = result[0]

    return NextResponse.json({ success: true, timeslot })
  } catch (error) {
    console.error('Update timeslot error:', error)
    return NextResponse.json({ error: 'Gagal memperbarui jadwal' }, { status: 500 })
  }
}

// DELETE /api/doctor/timeslots?id=xxx
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'id diperlukan' }, { status: 400 })
    }

    await prisma.timeSlot.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete timeslot error:', error)
    return NextResponse.json({ error: 'Gagal menghapus jadwal' }, { status: 500 })
  }
}

// Trigger Turbopack recompile
