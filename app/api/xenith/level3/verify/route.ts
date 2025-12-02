import { NextResponse } from 'next/server';
import { setOTP } from '@/lib/redis';
import Xenith from '@/schema/XenithSchema';
import { sendXenithOTP } from '@/lib/nodemailer';
import connectDB from '@/lib/connectdb';

export async function POST(req: Request) {
  try {
    const { level2Key } = await req.json();
    
    if (!level2Key) {
      return NextResponse.json({ error: 'Level 2 key is required' }, { status: 400 });
    }

    await connectDB();
    const team = await Xenith.findOne({ level2Key });

    if (!team) {
      return NextResponse.json({ error: 'Invalid Level 2 key' }, { status: 400 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await setOTP(`xenith:l3:${team.email}`, otp);
    await sendXenithOTP({ email: team.email, otp, level: 3 });

    return NextResponse.json({ 
      success: true, 
      email: team.email, 
      message: 'OTP sent to registered email' 
    });

  } catch (error) {
    console.error('Level 3 verification error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}