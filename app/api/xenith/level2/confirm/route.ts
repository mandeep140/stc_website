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

    // Check if user already has a level2Key
    const existingUser = await Xenith.findOne({ email });
    let level2Key;

    if (existingUser?.level2Key) {
      // Use existing key
      level2Key = existingUser.level2Key;
      console.log("Using existing level 2 key:", level2Key);
    } else {
      // Generate new key
      level2Key = generateLevelKey(2);
      console.log("Generated new level 2 key:", level2Key);
    }

    const updated = await Xenith.findOneAndUpdate(
      { email },
      {
        level2Key,
        "verifiedAt.level2": new Date(),
      },
      { new: true }
    );

    if (!updated) {
      console.error("Failed to update user with level2Key");
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }
    console.log("User updated successfully:", updated);

    await deleteOTP(`xenith:l2:verify:${email}`);

    return NextResponse.json({
      success: true,
      level2Key,
      message: "Level 2 key generated successfully!",
    });
  } catch (error) {
    console.error("Level 2 confirmation error:", error);
    return NextResponse.json({ error: "Confirmation failed" }, { status: 500 });
  }
}
