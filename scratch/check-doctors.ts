import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL!
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const users = await prisma.user.findMany({
    where: { role: 'DOCTOR' }
  })
  console.log('All Doctor Users in DB:')
  console.log(users.map(u => ({ id: u.id, name: u.name, email: u.email })))

  const doctorProfiles = await prisma.doctorProfile.findMany({
    include: {
      user: true
    }
  })
  console.log('All Doctor Profiles in DB:')
  console.log(doctorProfiles.map(dp => ({
    id: dp.id,
    userId: dp.userId,
    name: dp.user.name,
    email: dp.user.email,
    specialization: dp.specialization
  })))
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
