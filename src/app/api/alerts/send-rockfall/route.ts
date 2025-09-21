// import { NextResponse } from "next/server";
// import axios from "axios";
// import { prisma } from "@/lib/prisma";

// const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID!;
// const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN!;
// const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER!;
// const TWILIO_WHATSAPP_PHONE_NUMBER = process.env.TWILIO_WHATSAPP_PHONE_NUMBER!;

// export async function POST(req: Request) {
//   try {
//     const { zoneId, risk, riskLevel, coordinateId, adminId } = await req.json();

//     if (!adminId || !zoneId || !risk || !riskLevel || !coordinateId) {
//       return NextResponse.json(
//         { success: false, error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     // Get admin
//     const admin = await prisma.user.findUnique({ where: { id: adminId } });
//     if (!admin) return NextResponse.json({ success: false, error: "Admin not found" }, { status: 404 });
//     if (!admin.mineId) return NextResponse.json({ success: false, error: "Admin has no mine assigned" }, { status: 400 });

//     // Get miners in the admin's mine
//     const miners = await prisma.user.findMany({
//       where: { mineId: admin.mineId, role: "MINER" },
//       select: { phoneNo: true, name: true },
//     });

//     if (miners.length === 0) {
//       return NextResponse.json({ success: true, sentTo: 0, message: "No miners in this mine" });
//     }

//     // Construct message
//     const message = `⚠️ Rockfall Alert from ${admin.username}:
// Zone: ${zoneId} (${coordinateId})
// Risk Level: ${risk} (${riskLevel}%)
// Please stay alert and take precautions.`;

//     // Function to send via Twilio REST API
//     const sendTwilioMessage = async (to: string, body: string, channel: "sms" | "whatsapp") => {
//       try {
//         const from = channel === "whatsapp" ? `whatsapp:${TWILIO_PHONE_NUMBER}` : TWILIO_PHONE_NUMBER;
//         const toNumber = channel === "whatsapp" ? `whatsapp:${to}` : to;

//         await axios.post(
//           `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
//           new URLSearchParams({
//             From: from,
//             To: toNumber,
//             Body: body,
//           }),
//           {
//             headers: {
//               Authorization:
//                 "Basic " +
//                 Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64"),
//               "Content-Type": "application/x-www-form-urlencoded",
//             },
//           }
//         );
//       } catch (err) {
//         console.warn(`Failed to send ${channel} to ${to}:`, err);
//         // Ignore error, continue
//       }
//     };

//     // Send SMS + WhatsApp to each miner
//     const promises = miners.flatMap((m) => [
//       sendTwilioMessage(`+91${m.phoneNo}`, message, "sms"),
//       sendTwilioMessage(`+91${m.phoneNo}`, message, "whatsapp"),
//     ]);

//     await Promise.all(promises);

//     return NextResponse.json({ success: true, sentTo: miners.length });
//   } catch (err) {
//     console.error("Error sending rockfall alerts:", err);
//     return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import axios from "axios";
import { prisma } from "@/lib/prisma";

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID!;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN!;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER!;
const TWILIO_WHATSAPP_PHONE_NUMBER = process.env.TWILIO_WHATSAPP_PHONE_NUMBER!;

export async function POST(req: Request) {
  try {
    const { zoneId, risk, riskLevel, coordinateId, adminId } = await req.json();

    if (!adminId || !zoneId || !risk || !riskLevel || !coordinateId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get admin
    const admin = await prisma.user.findUnique({ where: { id: adminId } });
    if (!admin)
      return NextResponse.json(
        { success: false, error: "Admin not found" },
        { status: 404 }
      );
    if (!admin.mineId)
      return NextResponse.json(
        { success: false, error: "Admin has no mine assigned" },
        { status: 400 }
      );

    // Get miners in the admin's mine
    const miners = await prisma.user.findMany({
      where: { mineId: admin.mineId, role: "MINER" },
      select: { phoneNo: true, name: true },
    });

    if (miners.length === 0) {
      return NextResponse.json({
        success: true,
        sentTo: 0,
        message: "No miners in this mine",
      });
    }

    // Construct message
    const message = `⚠️ Rockfall Alert from ${admin.username}:
Zone: ${zoneId} (${coordinateId})
Risk Level: ${risk} (${riskLevel}%)
Please stay alert and take precautions.`;

    // Function to send via Twilio REST API
    const sendTwilioMessage = async (
      to: string,
      body: string,
      channel: "sms" | "whatsapp"
    ) => {
      try {
        const from =
          channel === "whatsapp"
            ? `whatsapp:${TWILIO_WHATSAPP_PHONE_NUMBER}`
            : TWILIO_PHONE_NUMBER;

        const toNumber = channel === "whatsapp" ? `whatsapp:${to}` : to;

        await axios.post(
          `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
          new URLSearchParams({
            From: from,
            To: toNumber,
            Body: body,
          }),
          {
            headers: {
              Authorization:
                "Basic " +
                Buffer.from(
                  `${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`
                ).toString("base64"),
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
      } catch (err) {
        console.warn(`Failed to send ${channel} to ${to}:`, err);
        // Ignore error, continue
      }
    };

    // Send SMS + WhatsApp to each miner
    const promises = miners.flatMap((m) => [
      sendTwilioMessage(`+91${m.phoneNo}`, message, "sms"),
      sendTwilioMessage(`+91${m.phoneNo}`, message, "whatsapp"),
    ]);

    await Promise.all(promises);

    return NextResponse.json({ success: true, sentTo: miners.length });
  } catch (err) {
    console.error("Error sending rockfall alerts:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
