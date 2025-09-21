// utils/checkSuperAdmin.ts

import { prisma } from "@/lib/prisma";

export async function checkSuperAdmin(username: string) {
  const user = await prisma.user.findUnique({ where: { username: username } });
  if (!user || user.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized: Only SUPER_ADMIN allowed");
  }
}
