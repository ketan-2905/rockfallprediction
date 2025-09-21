import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const miners = await prisma.user.findMany({
      where: {
        role: "MINER",
      },
      select: { id: true, name: true,  },
      orderBy: { name: "asc" }, // optional: alphabetically
    });

    return NextResponse.json(miners, { status: 200 });
  } catch (error) {
    console.error("Error fetching miners:", error);
    return NextResponse.json(
      { error: "Failed to fetch miners names" },
      { status: 500 }
    );
  }
}
