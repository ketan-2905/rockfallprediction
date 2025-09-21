import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const mines = await prisma.mine.findMany({
      select: { id: true, name: true,location: true },
      orderBy: { name: "asc" }, // optional: alphabetically
    });

    return NextResponse.json(mines, { status: 200 });
  } catch (error) {
    console.error("Error fetching mines:", error);
    return NextResponse.json(
      { error: "Failed to fetch mine names" },
      { status: 500 }
    );
  }
}
