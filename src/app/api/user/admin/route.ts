import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const admins = await prisma.user.findMany({
      where: {
        role: "ADMIN",
      },
      select: { id: true, name: true,  },
      orderBy: { name: "asc" }, // optional: alphabetically
    });

    return NextResponse.json(admins, { status: 200 });
  } catch (error) {
    console.error("Error fetching admins:", error);
    return NextResponse.json(
      { error: "Failed to fetch admins names" },
      { status: 500 }
    );
  }
}
