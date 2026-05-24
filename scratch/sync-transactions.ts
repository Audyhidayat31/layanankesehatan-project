import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL!
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const appointments = await prisma.appointment.findMany({
    include: {
      patient: true,
      doctor: true,
    }
  })
  
  console.log(`Found ${appointments.length} appointments in database.`)

  let createdCount = 0
  for (const apt of appointments) {
    const existingTx = await prisma.paymentTransaction.findFirst({
      where: {
        referenceId: apt.id,
        type: 'APPOINTMENT'
      }
    })

    if (!existingTx) {
      const userId = apt.patient?.userId
      const amount = apt.doctor?.price || 0
      
      if (userId) {
        await prisma.paymentTransaction.create({
          data: {
            userId,
            type: 'APPOINTMENT',
            referenceId: apt.id,
            amount,
            status: 'PAID',
            paymentMethod: 'E-Wallet',
            createdAt: apt.createdAt
          }
        })
        createdCount++
        console.log(`Created APPOINTMENT transaction for appointment ${apt.id} (amount: ${amount})`)
      }
    }
  }

  console.log(`Successfully created ${createdCount} missing transactions.`)
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
