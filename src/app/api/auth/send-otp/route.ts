import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { prisma } from "@/lib/prisma";

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID!;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN!;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER!;

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();
    if (!phone)
      return NextResponse.json(
        { success: false, error: "Phone required" },
        { status: 400 }
      );

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

      console.log(phone, otp);
      

    const user = await prisma.user.findUnique({
      where: { phoneNo: phone.slice(3) },
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

    // Store OTP in Redis for 5 minutes
    await redis.setEx(`otp:${phone}`, 300, otp);

    // Send OTP via Twilio REST API (Teleo link)
    const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;

    await fetch(url, {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString(
            "base64"
          ),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        From: TWILIO_PHONE_NUMBER,
        To: phone,
        Body: `Your OTP is ${otp}`,
      }),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error sending OTP via Twilio REST API:", err);
    return NextResponse.json(
      { success: false, error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}
