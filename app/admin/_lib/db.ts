import {PrismaClient} from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var mwonetPrisma: PrismaClient | undefined;
}

export const db = globalThis.mwonetPrisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.mwonetPrisma = db;
