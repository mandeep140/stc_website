import { NextResponse } from 'next/server';
import Xenith from '@/schema/XenithSchema';
import { Document } from 'mongoose';
import connectDB from '@/lib/connectdb';

interface IXenith extends Document {
  email: string;
  name: string;
  teamName: string;
  SunKey?: string;
  MoonKey?: string;
  verifiedAt: {
    Sun?: Date;
    Moon?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const normalize = (value?: string) => value?.trim();

function generateUniqueKey(email: string, teamName: string): string {
  // Generate a random 5-character alphanumeric string
  const randomChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  return `XEN-L2-${result}`;
}

export async function POST(req: Request) {
  try {
    console.log('Level 2 Registration request received');
    const body = await req.json();
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    const { SunKey, email, name, teamName } = body;

    if (!email || !name || !teamName || !SunKey) {
      console.error('Missing required fields:', { email, name, teamName, SunKey: !!SunKey });
      return NextResponse.json({ 
        success: false, 
        error: 'All fields are required',
        missingFields: {
          email: !email,
          name: !name,
          teamName: !teamName,
          SunKey: !SunKey
        }
      }, { status: 400 });
    }

    const normalizedEmail = normalize(email)?.toLowerCase();
    const normalizedName = normalize(name);
    const normalizedTeam = normalize(teamName);
    const normalizedSunKey = normalize(SunKey);
    
    if (!normalizedTeam || !normalizedEmail || !normalizedName || !normalizedSunKey) {
      console.error('Normalization failed:', { 
        normalizedEmail, 
        normalizedName, 
        normalizedTeam, 
        normalizedSunKey 
      });
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid input format',
        normalized: {
          email: normalizedEmail,
          name: normalizedName,
          teamName: normalizedTeam,
          SunKey: normalizedSunKey
        }
      }, { status: 400 });
    }

    if (!/^[^@\s]+@iitp\.ac\.in$/.test(normalizedEmail)) {
      console.error('Invalid email format:', normalizedEmail);
      return NextResponse.json({ 
        success: false, 
        error: 'Please use an IITP email address (example@iitp.ac.in)' 
      }, { status: 400 });
    }

    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected');

    // Check if email already exists and has a MoonKey
    console.log('Checking for existing user...');
    const existingUser = await Xenith.findOne<IXenith>({ 
      email: normalizedEmail 
    }).select('MoonKey SunKey').lean();
    
    if (existingUser && existingUser.MoonKey) {
      console.log('Existing user with level 2 key found:', normalizedEmail);
      return NextResponse.json({ 
        success: true, 
        message: 'Welcome back! Here is your existing Level 2 key',
        existing: true,
        key: existingUser.MoonKey
      }, { status: 200 });
    }

    // Verify the provided SunKey
    const SunUser = await Xenith.findOne<IXenith>({ 
      SunKey: normalizedSunKey 
    }).select('email SunKey').lean();

    if (!SunUser) {
      console.error('Invalid Level 1 key provided:', normalizedSunKey);
      return NextResponse.json({
        success: false,
        error: 'Invalid Level 1 key. Please check and try again.'
      }, { status: 400 });
    }

    // Check if the email matches the one associated with the SunKey
    if (SunUser.email !== normalizedEmail) {
      console.error('Email does not match Level 1 key owner:', { 
        providedEmail: normalizedEmail, 
        expectedEmail: SunUser.email 
      });
      return NextResponse.json({
        success: false,
        error: 'Email does not match the one associated with this Level 1 key.'
      }, { status: 400 });
    }

    // Generate a new level 2 key
    console.log('Generating new Level 2 key...');
    const newKey = generateUniqueKey(normalizedEmail, normalizedTeam);
    
    console.log('Creating/updating user with Level 2 key...');
    // Update existing user or create new one with MoonKey
    const updatedUser = await Xenith.findOneAndUpdate(
      { email: normalizedEmail },
      {
        $set: {
          name: normalizedName,
          teamName: normalizedTeam,
          MoonKey: newKey,
          'verifiedAt.Moon': new Date()
        },
        $setOnInsert: {
          SunKey: normalizedSunKey,
          'verifiedAt.Sun': new Date()
        }
      },
      { 
        new: true, 
        upsert: true,
        runValidators: true 
      }
    );

    console.log('User created/updated successfully:', updatedUser?.email);
    return NextResponse.json({ 
      success: true, 
      message: 'Level 2 registration successful',
      existing: false,
      key: newKey
    }, { status: 200 });

  } catch (error) {
    console.error('Level 2 registration error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ 
      success: false, 
      error: 'Registration failed',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
    }, { status: 500 });
  }
}