import { NextResponse } from 'next/server';
import { setOTP } from '@/lib/redis';
import { sendXenithOTP } from '@/lib/nodemailer';
import Xenith from '@/schema/XenithSchema';
import connectDB from '@/lib/connectdb';

const normalize = (value?: string) => value?.trim();

export async function POST(req: Request) {
  try {
    const { teamName, email, name } = await req.json();

    const normalizedEmail = normalize(email)?.toLowerCase();
    const normalizedName = normalize(name);
    const normalizedTeam = normalize(teamName);
    
    if (!normalizedTeam || !normalizedEmail || !normalizedName) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (!/^[^@\s]+@iitp\.ac\.in$/.test(normalizedEmail)) {
      return NextResponse.json({ error: 'Please use an IITP email address' }, { status: 400 });
    }

    await connectDB();

    const existing = await Xenith.findOne({ email: normalizedEmail });
    const existingKey = existing?.key;
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generating OTP for:', normalizedEmail);
    
    try {
      // Store the OTP and get the stored value back to ensure consistency
      const storedOTP = await setOTP(normalizedEmail, otp);
      console.log('OTP stored in Redis:', storedOTP ? '***' : 'failed');
      
      // Send the OTP via email
      console.log('Sending OTP email to:', normalizedEmail);
      await sendXenithOTP({ 
        email: normalizedEmail, 
        otp: storedOTP, // Use the stored OTP to ensure consistency
        level: 1 
      });
      
      console.log('OTP sent successfully to:', normalizedEmail);
    } catch (emailError) {
      console.error('Failed to process OTP:', emailError);
      return NextResponse.json({ 
        error: 'Failed to process OTP request. Please try again.' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'OTP sent to email',
      existing: !!existing,
      key: existingKey 
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}