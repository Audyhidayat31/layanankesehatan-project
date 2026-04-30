import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID tidak lengkap' }, { status: 400 })
    }

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    return NextResponse.json({
      success: true,
      notifications
    })
  } catch (error) {
    console.error('Fetch notifications error:', error)
    return NextResponse.json({ error: 'Gagal mengambil notifikasi' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Notification ID tidak lengkap' }, { status: 400 })
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    })

    return NextResponse.json({
      success: true,
      notification: updated
    })
  } catch (error) {
    console.error('Update notification error:', error)
    return NextResponse.json({ error: 'Gagal memperbarui notifikasi' }, { status: 500 })
  }
}
