import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validasi data webhook
    if (!data.order_id) {
      console.error("[Webhook] Missing order_id in webhook data")
      return NextResponse.json(
        { error: "order_id is required" },
        { status: 400 }
      )
    }

    if (!data.transaction_status) {
      console.error("[Webhook] Missing transaction_status in webhook data")
      return NextResponse.json(
        { error: "transaction_status is required" },
        { status: 400 }
      )
    }

    const {
      order_id,
      transaction_status,
      transaction_id,
      payment_type,
      fraud_status,
      gross_amount,
    } = data

    const cleanOrderId = String(order_id).trim();

    console.log(`[Webhook] Processing webhook for order_id: ${cleanOrderId}`)
    console.log(`[Webhook] Transaction status: ${transaction_status}`)

    // Cari payment berdasarkan order_id
    const transaction = await prisma.paymentTransaction.findFirst({
      where: {
        OR: [
          { id: cleanOrderId },
          { referenceId: cleanOrderId }
        ]
      }
    });

    if (!transaction) {
      console.error(`[Webhook] Payment not found for order_id: ${cleanOrderId}`)

      // Fallback: Check if order_id directly references Order or Appointment
      const fallbackOrder = await prisma.order.findUnique({ where: { id: cleanOrderId } });
      const fallbackAppointment = await prisma.appointment.findUnique({ where: { id: cleanOrderId } });

      if (!fallbackOrder && !fallbackAppointment) {
        return NextResponse.json(
          { error: "Payment not found" },
          { status: 404 }
        )
      }
    }

    // Mapping transaction_status ke status payment
    // Status yang valid: "pending", "settlement", "cancel", "expire", "deny", "capture", dll
    let paymentStatus = transaction_status.toLowerCase()

    // Validasi status
    const validStatuses = ["pending", "settlement", "cancel", "expire", "deny", "capture", "failure", "refund"]
    if (!validStatuses.includes(paymentStatus)) {
      console.warn(`[Webhook] Invalid transaction_status: ${transaction_status}, using "pending"`)
      paymentStatus = "pending"
    }

    // Normalisasi status "capture" menjadi "settlement"
    if (paymentStatus === "capture") {
      paymentStatus = "settlement"
    }

    // Mapping ke Enum Prisma (PaymentStatus)
    let dbStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' = 'PENDING';
    if (paymentStatus === 'settlement') {
      dbStatus = 'PAID';
    } else if (['deny', 'cancel', 'expire', 'failure'].includes(paymentStatus)) {
      dbStatus = 'FAILED';
    } else if (paymentStatus === 'refund') {
      dbStatus = 'REFUNDED';
    }

    console.log(`[Webhook] Mapped status: ${paymentStatus} -> ${dbStatus}`);

    // Update status PaymentTransaction
    if (transaction) {
      const updatedPayment = await prisma.paymentTransaction.update({
        where: { id: transaction.id },
        data: {
          status: dbStatus,
          paymentMethod: payment_type || transaction.paymentMethod,
        },
      })

      console.log(`[Webhook] Payment status updated: ${transaction.status} -> ${dbStatus}`)

      // Update Order status jika payment sudah settlement/PAID
      if (transaction.type === 'ORDER' && transaction.referenceId) {
        const order = await prisma.order.findUnique({ where: { id: transaction.referenceId } });

        if (order) {
          if (dbStatus === 'PAID' && order.paymentStatus !== 'PAID') {
            await prisma.order.update({
              where: { id: transaction.referenceId },
              data: {
                paymentStatus: 'PAID',
                status: 'PROCESSING'
              },
            })
            console.log(`[Webhook] Order ${transaction.referenceId} confirmed and processing`)
          } else if (dbStatus === 'FAILED' && order.status !== 'CANCELLED') {
            await prisma.order.update({
              where: { id: transaction.referenceId },
              data: {
                paymentStatus: 'FAILED',
                status: 'CANCELLED'
              },
            })
            console.log(`[Webhook] Order ${transaction.referenceId} cancelled`)
          }
        }
      }

      // Update Appointment status jika payment sudah settlement/PAID
      if (transaction.type === 'APPOINTMENT' && transaction.referenceId) {
        const appointment = await prisma.appointment.findUnique({ where: { id: transaction.referenceId } });

        if (appointment) {
          if (dbStatus === 'PAID' && appointment.status !== 'CONFIRMED') {
            await prisma.appointment.update({
              where: { id: transaction.referenceId },
              data: { status: 'CONFIRMED' },
            })
            console.log(`[Webhook] Appointment ${transaction.referenceId} confirmed`)
          } else if (dbStatus === 'FAILED' && appointment.status !== 'CANCELLED') {
            await prisma.appointment.update({
              where: { id: transaction.referenceId },
              data: { status: 'CANCELLED' },
            })
            console.log(`[Webhook] Appointment ${transaction.referenceId} cancelled`)
          }
        }
      }
    } else {
      // Fallback logic jika PaymentTransaction tidak ada, tapi terdaftar langsung di Order atau Appointment
      const order = await prisma.order.findUnique({ where: { id: cleanOrderId } });
      if (order) {
        if (dbStatus === 'PAID' && order.paymentStatus !== 'PAID') {
          await prisma.order.update({
            where: { id: cleanOrderId },
            data: { paymentStatus: 'PAID', status: 'PROCESSING' },
          })
          console.log(`[Webhook] Fallback Order ${cleanOrderId} confirmed and processing`)
        } else if (dbStatus === 'FAILED' && order.status !== 'CANCELLED') {
          await prisma.order.update({
            where: { id: cleanOrderId },
            data: { paymentStatus: 'FAILED', status: 'CANCELLED' },
          })
          console.log(`[Webhook] Fallback Order ${cleanOrderId} cancelled`)
        }
      } else {
        const appointment = await prisma.appointment.findUnique({ where: { id: cleanOrderId } });
        if (appointment) {
          if (dbStatus === 'PAID' && appointment.status !== 'CONFIRMED') {
            await prisma.appointment.update({
              where: { id: cleanOrderId },
              data: { status: 'CONFIRMED' },
            })
            console.log(`[Webhook] Fallback Appointment ${cleanOrderId} confirmed`)
          } else if (dbStatus === 'FAILED' && appointment.status !== 'CANCELLED') {
            await prisma.appointment.update({
              where: { id: cleanOrderId },
              data: { status: 'CANCELLED' },
            })
            console.log(`[Webhook] Fallback Appointment ${cleanOrderId} cancelled`)
          }
        }
      }
    }

    // Revalidate Next.js cache
    revalidatePath("/dashboard")
    revalidatePath("/admin")
    revalidatePath("/")

    return NextResponse.json({
      success: true,
      message: "Payment status updated successfully",
      orderId: cleanOrderId,
      status: paymentStatus,
    })
  } catch (error: any) {
    console.error("[Webhook] Error processing webhook:", error)
    return NextResponse.json(
      {
        error: "Failed to process webhook",
        message: error.message || "Internal server error",
      },
      { status: 500 }
    )
  }
}
