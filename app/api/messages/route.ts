import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId1 = searchParams.get('userId1')
    const userId2 = searchParams.get('userId2')

    if (!userId1 || !userId2) {
      return NextResponse.json({ error: 'User ID tidak lengkap' }, { status: 400 })
    }

    // Cari chatRoom yang berisi kedua user tersebut
    const chatRoom = await prisma.chatRoom.findFirst({
      where: {
        AND: [
          { participants: { some: { id: userId1 } } },
          { participants: { some: { id: userId2 } } }
        ]
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    return NextResponse.json({
      success: true,
      messages: chatRoom?.messages || []
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

    // Cari atau buat chatRoom
    let chatRoom = await prisma.chatRoom.findFirst({
      where: {
        AND: [
          { participants: { some: { id: senderId } } },
          { participants: { some: { id: receiverId } } }
        ]
      }
    })

    if (!chatRoom) {
      chatRoom = await prisma.chatRoom.create({
        data: {
          participants: {
            connect: [{ id: senderId }, { id: receiverId }]
          }
        }
      })
    }

    const newMessage = await prisma.chatMessage.create({
      data: {
        senderId,
        receiverId,
        content,
        type: type || 'TEXT',
        chatRoomId: chatRoom.id
      }
    })

    return NextResponse.json({
      success: true,
      message: newMessage
    })
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json({ error: 'Gagal mengirim pesan' }, { status: 500 })
  }
}
