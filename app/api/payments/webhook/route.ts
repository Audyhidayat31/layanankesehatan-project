import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || '';

export async function POST(req: Request) {
  try {
    const notification = await req.json();

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      payment_type,
    } = notification;

    // Verify the signature to ensure the request is truly from Midtrans
    const payload = `${order_id}${status_code}${gross_amount}${MIDTRANS_SERVER_KEY}`;
    const generatedSignature = crypto.createHash('sha512').update(payload).digest('hex');

    if (signature_key !== generatedSignature) {
      return NextResponse.json(
        { success: false, message: 'Invalid signature key' },
        { status: 401 }
      );
    }

    // Map Midtrans status to Database status
    let dbStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' = 'PENDING';

    if (transaction_status === 'settlement' || transaction_status === 'capture') {
      dbStatus = 'PAID';
    } else if (
      transaction_status === 'deny' ||
      transaction_status === 'cancel' ||
      transaction_status === 'expire' ||
      transaction_status === 'failure'
    ) {
      dbStatus = 'FAILED';
    } else if (transaction_status === 'refund') {
      dbStatus = 'REFUNDED';
    }

    // 1. Try to find and update Transaction
    const transaction = await prisma.paymentTransaction.findFirst({
      where: {
        OR: [
          { id: order_id },
          { referenceId: order_id }
        ]
      }
    });

    if (transaction) {
      await prisma.paymentTransaction.update({
        where: { id: transaction.id },
        data: { 
          status: dbStatus,
          paymentMethod: payment_type || transaction.paymentMethod
        }
      });
      
      // Sync Order paymentStatus if transaction relates to an ORDER
      if (transaction.type === 'ORDER' && transaction.referenceId) {
        await prisma.order.update({
          where: { id: transaction.referenceId },
          data: { paymentStatus: dbStatus }
        }).catch(() => {
           console.log(`Order ${transaction.referenceId} not found, skipping sync.`);
        }); 
      }
    } else {
      // 2. Fallback: Maybe the order_id directly references an Order
      const order = await prisma.order.findUnique({
        where: { id: order_id }
      });

      if (order) {
        await prisma.order.update({
          where: { id: order_id },
          data: { paymentStatus: dbStatus }
        });
      }
    }

    // Always return 200 OK to Midtrans so they stop retrying the webhook
    return NextResponse.json({ success: true, message: 'Webhook processed successfully' });

  } catch (error: any) {
    console.error('[WEBHOOK_ERROR]', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
