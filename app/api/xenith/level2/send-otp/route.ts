import { NextResponse } from 'next/server';
import { setOTP } from '@/lib/redis';
import { sendXenithOTP } from '@/lib/nodemailer';
import Xenith from '@/schema/XenithSchema';
import connectDB from '@/lib/connectdb';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!/^[^@\s]+@iitp\.ac\.in$/.test(email)) {
      return NextResponse.json({ error: 'Please use an IITP email address' }, { status: 400 });
    }

    await connectDB();
    
    // Check if email exists in database
    const team = await Xenith.findOne({ email });
    if (!team) {
      return NextResponse.json({ error: 'Email not found. Please complete Level 1 first.' }, { status: 404 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await setOTP(`xenith:l2:verify:${email}`, otp);
    await sendXenithOTP({ email, otp, level: 2 });

    return NextResponse.json({ 
      success: true, 
      message: 'OTP sent to email successfully' 
    });

  } catch (error) {
    console.error('Level 2 send OTP error:', error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}

