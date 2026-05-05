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

        // 1. Verifikasi Signature Key dari Midtrans
        const payload = `${order_id}${status_code}${gross_amount}${MIDTRANS_SERVER_KEY}`;
        const generatedSignature = crypto.createHash('sha512').update(payload).digest('hex');

        if (signature_key !== generatedSignature) {
            return NextResponse.json(
                { success: false, message: 'Invalid signature key' },
                { status: 401 }
            );
        }

        // 2. Mapping Status Midtrans ke Database Enum
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

        // 3. Cari Transaksi
        const transaction = await prisma.paymentTransaction.findFirst({
            where: {
                OR: [
                    { id: order_id },
                    { referenceId: order_id }
                ]
            },
            include: {
                user: true // Include user to send in-app notification later
            }
        });

        if (transaction) {
            // Update status di tabel Transaction
            await prisma.paymentTransaction.update({
                where: { id: transaction.id },
                data: {
                    status: dbStatus,
                    paymentMethod: payment_type || transaction.paymentMethod
                }
            });

            // Sinkronisasi status jika berhubungan dengan Order
            if (transaction.type === 'ORDER' && transaction.referenceId) {
                await prisma.order.update({
                    where: { id: transaction.referenceId },
                    data: { paymentStatus: dbStatus }
                }).catch(() => { });
            }

            // 4. Buat In-App Notification untuk User (Jika status berubah menjadi PAID atau FAILED)
            if ((dbStatus === 'PAID' || dbStatus === 'FAILED') && transaction.userId) {
                const title = dbStatus === 'PAID' ? 'Pembayaran Berhasil' : 'Pembayaran Gagal';
                const message = dbStatus === 'PAID'
                    ? `Pembayaran untuk transaksi ${order_id} sebesar Rp${gross_amount} telah berhasil.`
                    : `Pembayaran untuk transaksi ${order_id} gagal atau kadaluarsa.`;

                await prisma.notification.create({
                    data: {
                        userId: transaction.userId,
                        title,
                        message,
                        type: transaction.type === 'ORDER' ? 'ORDER' : 'SYSTEM',
                    }
                });
            }

        } else {
            // Fallback jika tidak ditemukan di Transaction, cari di Order langsung
            const order = await prisma.order.findUnique({
                where: { id: order_id },
                include: { patient: { include: { user: true } } }
            });

            if (order) {
                await prisma.order.update({
                    where: { id: order_id },
                    data: { paymentStatus: dbStatus }
                });

                // In-App Notification untuk Fallback Order
                if (dbStatus === 'PAID' || dbStatus === 'FAILED') {
                    const title = dbStatus === 'PAID' ? 'Pembayaran Berhasil' : 'Pembayaran Gagal';
                    const message = dbStatus === 'PAID'
                        ? `Pembayaran pesanan obat ${order_id} telah berhasil.`
                        : `Pembayaran pesanan obat ${order_id} gagal atau kadaluarsa.`;

                    await prisma.notification.create({
                        data: {
                            userId: order.patient.userId,
                            title,
                            message,
                            type: 'ORDER',
                        }
                    });
                }
            }
        }

        // Selalu kembalikan HTTP 200 OK ke Midtrans
        return NextResponse.json({ success: true, message: 'Notification processed successfully' });

    } catch (error: any) {
        console.error('[PAYMENT_NOTIFICATION_ERROR]', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
