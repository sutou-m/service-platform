import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

declare const globalThis: {
  prismaGlobal: PrismaClient;
} & typeof global;

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg(process.env.DIRECT_URL!);
  return new PrismaClient({ adapter });
}

export const prisma: PrismaClient =
  globalThis.prismaGlobal ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}

export default prisma;
