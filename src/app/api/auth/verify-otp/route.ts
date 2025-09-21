import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { phone, otp} = await req.json();

    

    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, error: "Phone and OTP required" },
        { status: 400 }
      );
    }

     const user = await prisma.user.findUnique({
        where: { phoneNo: phone.slice(3)},
        select: {
          id: true,
          username: true,
          name: true,
          role: true,
          mineId: true,
        },
      });

      if (!user) {
        return NextResponse.json(
          { success: false, error: "User not found" },
          { status: 404 }
        );
      }

       if (user.role !== "MINER") {
        return NextResponse.json(
          { success: false, error: "User is not miner" },
          { status: 404 }
        );
      }

    const storedOtp = await redis.get(`otp:${phone}`);

    if (storedOtp && storedOtp === otp) {
      await redis.del(`otp:${phone}`);

      // Fetch the user from database by phone
     

      return NextResponse.json({ success: true, user });
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
