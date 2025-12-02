import { NextResponse } from 'next/server';
import { getOTP, deleteOTP } from '@/lib/redis';
import Xenith from '@/schema/XenithSchema';
import connectDB from '@/lib/connectdb';

function generateLevelKey(level: number) {
  return `XEN-${level}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

const normalize = (value?: string) => value?.trim();

export async function POST(req: Request) {
  try {
    const { teamName, email, name, otp } = await req.json();
    console.log('Verification request received:', { email, teamName, name });

    const normalizedEmail = normalize(email)?.toLowerCase();
    const normalizedName = normalize(name);
    const normalizedTeam = normalize(teamName);
    const trimmedOtp = normalize(otp);
    
    if (!normalizedTeam || !normalizedEmail || !normalizedName || !trimmedOtp) {
      console.error('Missing required fields:', { normalizedTeam, normalizedEmail, normalizedName, hasOtp: !!trimmedOtp });
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    console.log('Verifying OTP for email:', normalizedEmail);
    
    // Get the stored OTP and ensure it's a string
    const storedOTP = await getOTP(normalizedEmail);
    console.log('Stored OTP:', storedOTP ? '***' : 'not found');
    
    if (!storedOTP) {
      console.error('No OTP found for email:', normalizedEmail);
      return NextResponse.json({ 
        error: 'OTP expired or not found. Please request a new OTP.' 
      }, { status: 400 });
    }
    
    // Ensure both OTPs are strings and trimmed for comparison
    const storedOTPString = storedOTP.toString().trim();
    const receivedOTPString = trimmedOtp.toString().trim();
    
    console.log('Comparing OTPs -', {
      storedLength: storedOTPString.length,
      receivedLength: receivedOTPString.length,
      storedType: typeof storedOTPString,
      receivedType: typeof receivedOTPString
    });
    
    if (storedOTPString !== receivedOTPString) {
      console.error('OTP mismatch. Expected:', JSON.stringify(storedOTPString), 'Received:', JSON.stringify(receivedOTPString));
      return NextResponse.json({ 
        error: 'Invalid OTP. Please check the code and try again.' 
      }, { status: 400 });
    }
    
    console.log('OTP verification successful for:', normalizedEmail);

    await connectDB();

    // Check if user already exists
    let user = await Xenith.findOne({ email: normalizedEmail });
    let level1Key: string;

    if (user) {
      // User exists, use existing key
      level1Key = user.level1Key;
      console.log('Existing user found, using existing key:', level1Key);
    } else {
      // New user, generate and save new key
      level1Key = generateLevelKey(1);
      console.log('New user, generating key:', level1Key);
      
      user = await Xenith.create({
        teamName: normalizedTeam,
        email: normalizedEmail,
        name: normalizedName,
        level1Key,
        verifiedAt: { level1: new Date() }
      });
    }

    // Delete the OTP after successful verification
    await deleteOTP(normalizedEmail);
    console.log('OTP deleted after successful verification for:', normalizedEmail);

    return NextResponse.json({ 
      success: true, 
      level1Key,
      existing: !!user.level1Key, // Indicate if this is an existing user
      message: user.level1Key ? 'Welcome back! Here is your key.' : 'Registration successful! Save your key for future levels.'
    });

  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}