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
  return `XEN-L1-${result}`;
}

export async function POST(req: Request) {
  try {
    console.log('Registration request received');
    const body = await req.json();
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    const { teamName, email, name } = body;

    if (!email || !name || !teamName) {
      console.error('Missing required fields:', { email, name, teamName });
      return NextResponse.json({ 
        success: false, 
        error: 'All fields are required',
        missingFields: {
          email: !email,
          name: !name,
          teamName: !teamName
        }
      }, { status: 400 });
    }

    const normalizedEmail = normalize(email)?.toLowerCase();
    const normalizedName = normalize(name);
    const normalizedTeam = normalize(teamName);
    
    if (!normalizedTeam || !normalizedEmail || !normalizedName) {
      console.error('Normalization failed:', { normalizedEmail, normalizedName, normalizedTeam });
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid input format',
        normalized: {
          email: normalizedEmail,
          name: normalizedName,
          teamName: normalizedTeam
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

    // Check if email already exists
    console.log('Checking for existing user...');
    const existingUser = await Xenith.findOne<IXenith>({ email: normalizedEmail }).select('SunKey').lean();
    
    if (existingUser && existingUser.SunKey) {
      console.log('Existing user found:', normalizedEmail);
      return NextResponse.json({ 
        success: true, 
        message: 'Welcome back! Here is your existing key',
        existing: true,
        key: existingUser.SunKey
      }, { status: 200 });
    }

    // Generate a unique key for new registration
    console.log('Generating new key...');
    const newKey = generateUniqueKey(normalizedEmail, normalizedTeam);
    
    console.log('Creating new user...');
    // Create new user with the generated keys
    const newUser = await Xenith.create({
      name: normalizedName,
      email: normalizedEmail,
      teamName: normalizedTeam,
      SunKey: newKey,
      level: 1
    });

    console.log('User created successfully:', newUser.email);
    return NextResponse.json({ 
      success: true, 
      message: 'Registration successful',
      existing: false,
      key: newKey
    });

  } catch (error) {
    console.error('Registration error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ 
      success: false, 
      error: 'Registration failed',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
    }, { status: 500 });
  }
}