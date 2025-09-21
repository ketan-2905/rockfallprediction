// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import { prisma } from "@/lib/prisma";

// export async function POST(req: Request) {
//   try {
//     const { username, password, mineId } = await req.json();

//     if (!username || !password || !mineId) {
//       return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
//     }

//     const admin = await prisma.user.findFirst({
//       where: { username, role: "ADMIN", mineId: Number(mineId) },
//     });

//     if (!admin) {
//       return NextResponse.json({ success: false, error: "Admin not found for this mine" }, { status: 404 });
//     }

//     const isPasswordValid = await bcrypt.compare(password, admin.password);
//     if (!isPasswordValid) {
//       return NextResponse.json({ success: false, error: "Incorrect password" }, { status: 401 });
//     }

//     // You can add JWT/session logic here if needed
//     return NextResponse.json({ success: true, admin: { id: admin.id, username: admin.username, name: admin.name,role: admin.role } });
//   } catch (err: any) {
//     console.error(err);
//     return NextResponse.json({ success: false, error: err.message }, { status: 500 });
//   }
// }
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { username, password, mineId } = await req.json();

    if (!username || !password || !mineId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const admin = await prisma.user.findFirst({
      where: { username, role: "ADMIN", mineId: Number(mineId) },
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Admin not found for this mine" },
        { status: 404 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: "Incorrect password" },
        { status: 401 }
      );
    }

    // You can add JWT/session logic here if needed
    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        username: admin.username,
        name: admin.name,
        role: admin.role,
      },
    });
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
