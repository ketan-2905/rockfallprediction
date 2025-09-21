import { prisma } from "@/lib/prisma";
import { checkSuperAdmin } from "@/utils/checkSuperAdmin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const adminUsername = "SuperAdmin_1";
    await checkSuperAdmin(adminUsername);

    const { name, description, location, lat, lng } = await req.json();

    if (!name || !location || !lat || !lng) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const mine = await prisma.mine.create({
      data: { name, description, location, lat, lng },
    });

    return NextResponse.json({ success: true, mine });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err);
      return NextResponse.json(
        { success: false, error: err.message },
        { status: 500 }
      );
    }
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}

// catch (err: any) {
//     console.error(err);
//     return NextResponse.json({ success: false, error: err.message }, { status: 403 });
//   }
