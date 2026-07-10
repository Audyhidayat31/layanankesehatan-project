import { NextResponse } from 'next/server';
import midtransClient from 'midtrans-client';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { transactionId } = body;

    if (!transactionId) {
      return NextResponse.json(
        { success: false, message: 'transactionId is required' },
        { status: 400 }
      );
    }

    // 1. Ambil data transaksi beserta user dari database
    const dbTransaction = await prisma.paymentTransaction.findUnique({
      where: { id: transactionId },
      include: {
        user: true,
      },
    });

    if (!dbTransaction) {
      return NextResponse.json(
        { success: false, message: 'Transaction not found in database' },
        { status: 404 }
      );
    }

    // 2. Inisialisasi Midtrans Snap API Instance
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY || '',
      clientKey: process.env.MIDTRANS_CLIENT_KEY || ''
    });

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const referer = req.headers.get('referer') || `${origin}/patient/orders`;

    // 3. Persiapkan parameter payload sesuai data dari Database
    const parameter = {
      transaction_details: {
        order_id: dbTransaction.id, 
        gross_amount: Math.round(dbTransaction.amount),
      },
      customer_details: {
        first_name: dbTransaction.user.name,
        email: dbTransaction.user.email,
        phone: dbTransaction.user.phone || '000000000000',
      },
      credit_card: {
        secure: true
      },
      callbacks: {
        finish: referer,
      }
    };

    // 4. Generate transaction token dari Midtrans
    const midtransTransaction = await (snap as any).createTransaction(parameter);

    // 5. Kembalikan token ke client
    return NextResponse.json({
      success: true,
      token: midtransTransaction.token,
      redirect_url: midtransTransaction.redirect_url,
    });

  } catch (error: any) {
    console.error('[CREATE_TOKEN_ERROR]', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
