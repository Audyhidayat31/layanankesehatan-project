import 'dotenv/config'
import prisma from '../lib/prisma'

async function main() {
  console.log('Updating all doctor profiles to be online...')
  const result = await prisma.doctorProfile.updateMany({
    data: {
      isOnline: true
    }
  })
  console.log(`Successfully updated ${result.count} doctor profiles to be online.`)
}

main()
  .catch(e => {
    console.error('Error updating doctor profiles:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
