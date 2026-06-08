import 'dotenv/config'
import prisma from '../lib/prisma'

async function main() {
  console.log('Testing featured-doctors query...')
  const popularDoctors = await prisma.doctorProfile.findMany({
    include: {
      user: true,
    },
    orderBy: [
      { rating: 'desc' },
      { user: { createdAt: 'desc' } }
    ],
    take: 4,
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
