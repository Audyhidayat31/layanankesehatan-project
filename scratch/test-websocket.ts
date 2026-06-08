import 'dotenv/config'
import prisma from '../lib/prisma'

async function main() {
  console.log('Testing featured-doctors query via WebSocket adapter...')
  const popularDoctors = await prisma.doctorProfile.findMany({
    include: {
      user: true,
    },
    take: 4,
  })
  console.log('Success! Results count:', popularDoctors.length)
}

main()
  .catch(err => {
    console.error('Error running WebSocket query:', err)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
