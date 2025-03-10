import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

// Kept for debugging reasons
// export const prisma = globalForPrisma.prisma ?? new PrismaClient({
//   log: [
//     {
//       emit: "event",
//       level: "query",
//     },
//   ],
// });

// prisma.$on("query" as never, async (e: Prisma.QueryEvent) => {
//   console.log(`${e.query} ${e.params}`);
// });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
