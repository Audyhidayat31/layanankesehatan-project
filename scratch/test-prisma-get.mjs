import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const timeslots = await prisma.timeSlot.findMany({
    where: { doctorId: 'cmpqsfe1x000130uoujj3jv37' }
  })
  console.log(timeslots.map(t => ({ id: t.id, isActive: t.isActive })))
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
