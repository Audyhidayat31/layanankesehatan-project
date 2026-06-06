require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const doctors = await prisma.doctorProfile.findMany({
    include: {
      user: true
    }
  });
  console.log("Doctors length:", doctors.length);
  for (const doc of doctors) {
    console.log({
      id: doc.id,
      name: doc.user?.name,
      specialization: doc.specialization,
      hospital: doc.hospital,
      practiceAddress: doc.practiceAddress
    });
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
