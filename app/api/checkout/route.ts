import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { userId, amount, orderId, type = 'ORDER' } = await req.json();

    if (!userId || !amount || !orderId) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        type,
        referenceId: orderId,
        amount,
        status: 'PENDING',
      }
    });

    return NextResponse.json({ success: true, transactionId: transaction.id });
  } catch (error: any) {
    console.error('Checkout API error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
