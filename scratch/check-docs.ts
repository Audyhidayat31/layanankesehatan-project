import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const doctors = await prisma.doctorProfile.findMany({
    include: { user: true }
  })
  for (const d of doctors) {
    console.log(`Doctor ID: ${d.id}, User ID: ${d.userId}, Name: ${d.user.name}`)
    console.log(`  isOnlineEnabled: ${d.isOnlineEnabled}, isOfflineEnabled: ${d.isOfflineEnabled}, duration: ${d.consultationDuration}`)
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
