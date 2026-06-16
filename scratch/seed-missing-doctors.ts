import 'dotenv/config'
import prisma from '../lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  const targetSpecialties = [
    { spec: 'Dokter Umum', name: 'Andi' },
    { spec: 'Spesialis Jantung', name: 'Budi' },
    { spec: 'Spesialis Anak', name: 'Citra' },
    { spec: 'Spesialis Mata', name: 'Diana' },
    { spec: 'Spesialis Saraf', name: 'Eko' },
    { spec: 'Spesialis Bedah', name: 'Fahmi' },
    { spec: 'Dokter Gigi', name: 'Gita' },
    { spec: 'Spesialis THT', name: 'Hadi' }
  ]

  const existingDoctors = await prisma.doctorProfile.findMany({
    include: { user: true }
  })

  console.log('Existing doctors:')
  existingDoctors.forEach(d => console.log(`- ${d.user.name} (${d.specialization})`))

  const existingSpecs = existingDoctors.map(d => d.specialization.toLowerCase())

  for (const target of targetSpecialties) {
    // Check if we already have a doctor with this exact specialty or if the target contains the existing spec
    if (existingSpecs.some(s => s === target.spec.toLowerCase() || s.includes(target.spec.toLowerCase().replace('spesialis ', '')))) {
      console.log(`\nSkipping ${target.spec} - already covered.`)
      continue
    }

    console.log(`\nCreating doctor for ${target.spec}...`)
    
    const hashedPassword = await bcrypt.hash('password123', 10)
    const email = `${target.name.toLowerCase()}@gmail.com`
    
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
        console.log(`User ${email} already exists, skipping...`)
        continue
    }

    const user = await prisma.user.create({
      data: {
        name: `Dr. ${target.name}`,
        email: email,
        password: hashedPassword,
        role: 'DOCTOR',
        doctorProfile: {
          create: {
            specialization: target.spec,
            hospital: 'MedConnect Hospital',
            experience: Math.floor(Math.random() * 10) + 5,
            price: 150000 + (Math.floor(Math.random() * 5) * 50000),
            isVerified: true,
            isOnline: true,
            rating: 4.8,
            reviewCount: 20
          }
        }
      }
    })

    console.log(`Created ${user.name} (${target.spec}) with email ${user.email} and password: password123`)
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
