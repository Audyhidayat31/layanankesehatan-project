import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { userId, amount, orderId, type = 'ORDER' } = await req.json();

    if (!userId || !amount || !orderId) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    // Pastikan amount adalah angka dan type adalah uppercase sesuai Enum Prisma
    const transaction = await prisma.paymentTransaction.create({
      data: {
        userId,
        type: (type as string).toUpperCase() as any,
        referenceId: orderId,
        amount: Number(amount),
        status: 'PENDING',
      }
    });

    return NextResponse.json({ success: true, transactionId: transaction.id });
  } catch (error: any) {
    console.error('Checkout API error:', error);
    // Berikan detail error yang lebih informatif jika ada
    const errorMessage = error.message || 'Internal Server Error';
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
