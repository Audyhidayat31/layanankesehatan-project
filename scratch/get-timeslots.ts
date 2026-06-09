import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const timeslots = await prisma.timeSlot.findMany()
  console.log(JSON.stringify(timeslots, null, 2))
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
