import { NextResponse } from "next/server";
import { getOTP, deleteOTP } from "@/lib/redis";
import Xenith from "@/schema/XenithSchema";
import connectDB from "@/lib/connectdb";

function generateLevelKey(level: number) {
  return `XEN-${level}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // Verify OTP
    const storedOTP = await getOTP(`xenith:l2:verify:${email}`);
    if (!storedOTP || storedOTP !== otp) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already has a MoonKey
    const existingUser = await Xenith.findOne({ email });
    let MoonKey;

    if (existingUser?.MoonKey) {
      // Use existing key
      MoonKey = existingUser.MoonKey;
      console.log("Using existing level 2 key:", MoonKey);
    } else {
      // Generate new key
      MoonKey = generateLevelKey(2);
      console.log("Generated new level 2 key:", MoonKey);
    }

    const updated = await Xenith.findOneAndUpdate(
      { email },
      {
        MoonKey,
        "verifiedAt.Moon": new Date(),
      },
      { new: true }
    );

    if (!updated) {
      console.error("Failed to update user with MoonKey");
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }
    console.log("User updated successfully:", updated);

    await deleteOTP(`xenith:l2:verify:${email}`);

    return NextResponse.json({
      success: true,
      MoonKey,
      message: "Level 2 key generated successfully!",
    });
  } catch (error) {
    console.error("Level 2 confirmation error:", error);
    return NextResponse.json({ error: "Confirmation failed" }, { status: 500 });
  }
}
