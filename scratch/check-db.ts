import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const appointments = await prisma.appointment.findMany()
  console.log('Appointments in DB:', appointments.length)
  if (appointments.length > 0) {
    console.log('Sample appointment ID:', appointments[0].id)
  }
  
  const patients = await prisma.patientProfile.findMany()
  console.log('Patients in DB:', patients.length)
  
  const users = await prisma.user.findMany()
  console.log('Users in DB:', users.length)
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
