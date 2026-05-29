import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import * as dotenv from 'dotenv'

dotenv.config()

const connectionString = process.env.DATABASE_URL!
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const email = 'apotek@demo.com'
  
  // Periksa apakah user apotek sudah ada
  let user = await prisma.user.findUnique({
    where: { email }
  })
  
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: 'Apotek Sehat Selalu',
        email: email,
        password: 'password123', // plain text as per login route
        role: 'PHARMACY',
        pharmacyProfile: {
          create: {
            name: 'Apotek Sehat Selalu',
            address: 'Jl. Sudirman No. 45',
            city: 'Jakarta',
            phone: '081234567890',
            operatingHours: '08:00 - 22:00',
            isVerified: true,
            isOpen: true,
            rating: 4.8,
            reviewCount: 150
          }
        }
      }
    })
    console.log('Pharmacy user and profile created successfully:', user.email)
  } else {
    console.log('Pharmacy user already exists:', user.email)
    
    // Ensure profile exists
    const profile = await prisma.pharmacyProfile.findUnique({
      where: { userId: user.id }
    })
    
    if (!profile) {
      await prisma.pharmacyProfile.create({
        data: {
          userId: user.id,
          name: 'Apotek Sehat Selalu',
          address: 'Jl. Sudirman No. 45',
          city: 'Jakarta',
          phone: '081234567890',
          operatingHours: '08:00 - 22:00',
          isVerified: true,
          isOpen: true,
          rating: 4.8,
          reviewCount: 150
        }
      })
      console.log('Pharmacy profile added to existing user')
    }
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
