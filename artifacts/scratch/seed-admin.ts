import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import 'dotenv/config'

const connectionString = process.env.DATABASE_URL!
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const adminEmail = 'admin@gmail.com'
  
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  })

  if (existingAdmin) {
    console.log('Admin account already exists.')
    return
  }

  const admin = await prisma.user.create({
    data: {
      name: 'Admin HealthServices',
      email: adminEmail,
      password: 'admin123',
      role: 'ADMIN',
    }
  })

  console.log('Admin account created successfully:', admin)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
