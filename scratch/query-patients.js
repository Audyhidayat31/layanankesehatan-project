require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const patients = await prisma.patientProfile.findMany({
    include: {
      user: true
    }
  });
  console.log("Patients length:", patients.length);
  for (const pat of patients) {
    console.log({
      id: pat.id,
      userId: pat.userId,
      name: pat.user?.name,
      email: pat.user?.email
    });
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
