import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const timeslot = await prisma.timeSlot.create({
    data: {
      doctorId: 'cmpqsfe1x000130uoujj3jv37',
      date: new Date('2026-06-09'),
      startTime: '08:00',
      endTime: '09:00',
      isActive: true,
    },
  })
  console.log(timeslot)
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
