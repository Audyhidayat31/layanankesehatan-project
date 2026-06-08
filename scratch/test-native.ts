import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Testing featured-doctors query with native Prisma engine...')
  const popularDoctors = await prisma.doctorProfile.findMany({
    include: {
      user: true,
    },
    orderBy: {
      rating: 'desc',
    },
    take: 10,
  })
  console.log('Results count:', popularDoctors.length)
}

main()
  .catch(err => {
    console.error('Error running test query:', err)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
