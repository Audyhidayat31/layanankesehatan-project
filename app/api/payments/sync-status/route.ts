import { NextResponse } from 'next/server';
import midtransClient from 'midtrans-client';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { orderId } = body;

        if (!orderId) {
            return NextResponse.json(
                { success: false, message: 'orderId is required' },
                { status: 400 }
            );
        }

        // Inisialisasi Midtrans Core API Client
        const coreApi = new midtransClient.CoreApi({
            isProduction: false, // Ubah ke true jika sudah live
            serverKey: process.env.MIDTRANS_SERVER_KEY || '',
            clientKey: process.env.MIDTRANS_CLIENT_KEY || ''
        });

        // Panggil status dari Midtrans
        const statusResponse = await (coreApi as any).transaction.status(orderId);

        if (statusResponse.status_code === '404') {
            return NextResponse.json(
                { success: false, message: 'Transaction not found in Midtrans' },
                { status: 404 }
            );
        }

        const { transaction_status, payment_type } = statusResponse;

        // Map Midtrans status ke Database Enum status
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

        // 1. Coba perbarui di tabel Transaction (jika ada)
        const transaction = await prisma.paymentTransaction.findFirst({
            where: {
                OR: [
                    { id: orderId },
                    { referenceId: orderId }
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

            // Sinkronisasi tabel Order jika transaksi ini berkaitan dengan Order
            if (transaction.type === 'ORDER' && transaction.referenceId) {
                await prisma.order.update({
                    where: { id: transaction.referenceId },
                    data: { 
                        paymentStatus: dbStatus,
                        ...(dbStatus === 'PAID' ? { status: 'PROCESSING' } : {})
                    }
                }).catch(() => { }); // Abaikan error jika order tidak ditemukan
            }

            // Sinkronisasi tabel Appointment jika berkaitan
            if (transaction.type === 'APPOINTMENT' && transaction.referenceId) {
                await prisma.appointment.update({
                    where: { id: transaction.referenceId },
                    data: {
                        ...(dbStatus === 'PAID' ? { status: 'CONFIRMED' } : {})
                    }
                }).catch(() => { });
            }
        } else {
            // 2. Fallback: Coba perbarui langsung di tabel Order
            const order = await prisma.order.findUnique({
                where: { id: orderId }
            });

            if (order) {
                await prisma.order.update({
                    where: { id: orderId },
                    data: { 
                        paymentStatus: dbStatus,
                        ...(dbStatus === 'PAID' ? { status: 'PROCESSING' } : {})
                    }
                });
            } else {
                // Fallback: Coba perbarui langsung di tabel Appointment
                const appointment = await prisma.appointment.findUnique({
                    where: { id: orderId }
                });

                if (appointment) {
                    await prisma.appointment.update({
                        where: { id: orderId },
                        data: {
                            ...(dbStatus === 'PAID' ? { status: 'CONFIRMED' } : {})
                        }
                    });
                } else {
                    return NextResponse.json(
                        { success: false, message: 'Transaction, Order, or Appointment not found in database' },
                        { status: 404 }
                    );
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Status synchronized successfully',
            data: {
                orderId,
                midtransStatus: transaction_status,
                dbStatus,
                paymentType: payment_type
            }
        });

    } catch (error: any) {
        console.error('[SYNC_STATUS_ERROR]', error);

        // Jika 404 dari Midtrans Client (error MidtransError)
        if (error.httpStatusCode === 404) {
            return NextResponse.json(
                { success: false, message: 'Transaction not found in Midtrans' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: false, message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
