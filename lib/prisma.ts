import { PrismaClient } from '@prisma/client'
import { neonConfig, Pool } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import ws from 'ws'

// Set the WebSocket constructor for the Neon driver to bypass raw TCP port 5432 blocks
neonConfig.webSocketConstructor = ws

const connectionString = process.env.DATABASE_URL!

const poolConfig = { connectionString }
const adapter = new PrismaNeon(poolConfig)

const prismaClientSingleton = () => {
  return new PrismaClient({ adapter })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma

// Trigger reload
