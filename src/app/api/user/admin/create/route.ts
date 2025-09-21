import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { checkSuperAdmin } from "@/utils/checkSuperAdmin";
import { prisma } from "@/lib/prisma";


export async function POST(req: Request) {
  try {
    const adminUsername = "SuperAdmin_1"
    await checkSuperAdmin(adminUsername);


    const { username, password, name, phoneNo, mineId } = await req.json();

    if (!username || !password || !name || !mineId) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        name,
        phoneNo,
        role: "ADMIN",
        mine: { connect: { id: Number(mineId) } },
      },
    });

    return NextResponse.json({ success: true, admin });
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
