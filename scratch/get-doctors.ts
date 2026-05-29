import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const doctors = await prisma.user.findMany({
    where: { role: 'DOCTOR' },
    select: { id: true, name: true, email: true, password: true }
  })
  console.log(doctors)
}

main().catch(console.error).finally(() => prisma.$disconnect())
