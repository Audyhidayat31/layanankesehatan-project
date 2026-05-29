import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const audy = await prisma.user.findFirst({
      where: { name: { contains: 'Audy', mode: 'insensitive' } }
    })
    return NextResponse.json({ success: true, user: audy })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
