import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId1 = searchParams.get('userId1')
    const userId2 = searchParams.get('userId2')

    if (!userId1) {
      return NextResponse.json({ error: 'User ID tidak lengkap' }, { status: 400 })
    }

    // Query langsung ke ChatMessage berdasarkan userId
    const whereClause = userId2
      ? {
        OR: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 },
        ],
      }
      : {
        OR: [
          { senderId: userId1 },
          { receiverId: userId1 },
        ],
      }

    const messages = await prisma.chatMessage.findMany({
      where: whereClause,
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { id: true, name: true, email: true, role: true } },
        receiver: { select: { id: true, name: true, email: true, role: true } },
      },
    })

    return NextResponse.json({
      success: true,
      messages: messages || [],
    })
  } catch (error) {
    console.error('Fetch messages error:', error)
    return NextResponse.json({ error: 'Gagal mengambil pesan' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { senderId, receiverId, content, type } = await req.json()

    if (!senderId || !receiverId || !content) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
    }

    // Pastikan kedua user ada di database
    const [senderExists, receiverExists] = await Promise.all([
      prisma.user.findUnique({ where: { id: senderId }, select: { id: true, name: true } }),
      prisma.user.findUnique({ where: { id: receiverId }, select: { id: true } }),
    ])

    if (!senderExists || !receiverExists) {
      return NextResponse.json(
        { error: 'User pengirim atau penerima tidak ditemukan di database' },
        { status: 404 }
      )
    }

    // Cari atau buat ChatRoom
    let chatRoom = await prisma.chatRoom.findFirst({
      where: {
        AND: [
          { participants: { some: { id: senderId } } },
          { participants: { some: { id: receiverId } } },
        ],
      },
    })

    if (!chatRoom) {
      chatRoom = await prisma.chatRoom.create({
        data: {
          participants: {
            connect: [{ id: senderId }, { id: receiverId }],
          },
        },
      })
    }

    const newMessage = await prisma.chatMessage.create({
      data: {
        senderId,
        receiverId,
        content,
        type: type?.toUpperCase() || 'TEXT',
        chatRoomId: chatRoom.id,
      },
    })

    // Buat notifikasi untuk penerima (tidak boleh gagalkan pengiriman)
    try {
      await prisma.notification.create({
        data: {
          userId: receiverId,
          title: `Pesan Baru|${senderId}`,
          message: `${senderExists.name} mengirim pesan: ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`,
          type: 'CHAT',
        },
      })
    } catch (notifError) {
      console.error('Failed to create notification:', notifError)
    }

    return NextResponse.json({
      success: true,
      message: newMessage,
    })
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json({ error: 'Gagal mengirim pesan' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { senderId, receiverId } = await req.json()

    if (!senderId || !receiverId) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
    }

    // Mark messages as read
    await prisma.chatMessage.updateMany({
      where: {
        senderId,
        receiverId,
        isRead: false
      },
      data: {
        isRead: true
      }
    })

    // Also mark related notifications as read
    // Since we don't have senderId in Notification model, we try to match by type and recipient
    // and maybe title 'Pesan Baru'
    await prisma.notification.updateMany({
      where: {
        userId: receiverId,
        type: 'CHAT',
        isRead: false
      },
      data: {
        isRead: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Pesan telah ditandai sebagai terbaca'
    })
  } catch (error) {
    console.error('Update messages read status error:', error)
    return NextResponse.json({ error: 'Gagal memperbarui status pesan' }, { status: 500 })
  }
}
