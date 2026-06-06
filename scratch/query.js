require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const appointments = await prisma.appointment.findMany({
    include: {
      patient: {
        include: {
          user: true
        }
      },
      doctor: {
        include: {
          user: true
        }
      }
    }
  });
  console.log("Appointments length:", appointments.length);
  for (const apt of appointments) {
    console.log({
      id: apt.id,
      patientName: apt.patient?.user?.name,
      doctorName: apt.doctor?.user?.name,
      date: apt.date,
      time: apt.time,
      status: apt.status,
      type: apt.type
    });
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
