import { NextResponse } from 'next/server';
import { getOTP, deleteOTP } from '@/lib/redis';
import Xenith from '@/schema/XenithSchema';
import connectDB from '@/lib/connectdb';

function generateLevelKey(level: number) {
  return `XEN-${level}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();
    
    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
    }

    // Verify OTP
    const storedOTP = await getOTP(`xenith:l3:verify:${email}`);
    if (!storedOTP || storedOTP !== otp) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
    }

    await connectDB();

    // Check if user exists and has completed level 2
    const existingUser = await Xenith.findOne({ email });
    if (!existingUser) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    if (!existingUser.level2Key) {
      return NextResponse.json(
        { error: 'Please complete Level 2 first' }, 
        { status: 400 }
      );
    }

    // Check if user already has a level3Key
    let level3Key;
    if (existingUser.level3Key) {
      // Use existing key
      level3Key = existingUser.level3Key;
      console.log("Using existing level 3 key:", level3Key);
    } else {
      // Generate new key
      level3Key = generateLevelKey(3);
      console.log("Generated new level 3 key:", level3Key);
    }

    const updated = await Xenith.findOneAndUpdate(
      { email },
      { 
        level3Key,
        'verifiedAt.level3': new Date() 
      },
      { new: true }
    );

    if (!updated) {
      console.error("Failed to update user with level3Key");
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    // Delete the used OTP
    await deleteOTP(`xenith:l3:verify:${email}`);

    return NextResponse.json({ 
      success: true, 
      level3Key,
      message: 'Congratulations! You have completed all levels of Xenith!' 
    });

  } catch (error) {
    console.error('Level 3 confirmation error:', error);
    return NextResponse.json({ error: 'Confirmation failed' }, { status: 500 });
  }
}