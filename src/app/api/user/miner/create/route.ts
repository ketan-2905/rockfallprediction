import { prisma } from "@/lib/prisma";
import { checkSuperAdmin } from "@/utils/checkSuperAdmin";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  try {
    const userId = Number(req.headers.get("x-user-id"));
    (userId);

    const { username, password, name, phoneNo, managedBy } = await req.json();

    if (!username || !password || !name || !managedBy) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const admin = await prisma.user.findUnique({ where: { id: Number(managedBy) } });
    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Invalid admin" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const miner = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        name,
        phoneNo,
        role: "MINER",
        managedBy: admin.id,
        mineId: admin.mineId,
      },
    });

    return NextResponse.json({ success: true, miner });
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

//   catch (err: any) {
//     console.error(err);
//     return NextResponse.json({ success: false, error: err.message }, { status: 403 });
//   }
// }
