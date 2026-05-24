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
      patient: { include: { user: true } },
      doctor: { include: { user: true } }
    }
  })
  console.log('All Appointments in DB:')
  console.log(appointments.map(a => ({
    id: a.id,
    patientName: a.patient?.user?.name,
    patientUserId: a.patient?.userId,
    doctorName: a.doctor?.user?.name,
    doctorUserId: a.doctor?.userId,
    date: a.date,
    time: a.time,
    status: a.status
  })))
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
