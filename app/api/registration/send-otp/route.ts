import { NextRequest, NextResponse } from 'next/server';
import { setOTP } from '@/lib/redis';
import { sendOTPEmail } from '@/lib/nodemailer';
import connectDB from '@/lib/connectdb';
import RegistrationTemplate from '@/schema/RegistrationTemplateSchema';

export async function POST(request: NextRequest) {
  try {
    const { email, registrationSlug } = await request.json();

    if (!email || !registrationSlug) {
      return NextResponse.json({ error: 'Email and registration slug are required' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    await connectDB();

    const template = await RegistrationTemplate.findOne({ slug: registrationSlug, active: true });
    
    if (!template) {
      return NextResponse.json({ error: 'Registration form not found' }, { status: 404 });
    }

    const emailField = template.fields.find((f: { type: string; emailRestriction?: string }) => f.type === 'email');
    
    if (!emailField) {
      return NextResponse.json({ error: 'This form does not require email verification' }, { status: 400 });
    }

    if (emailField.emailRestriction === 'iitp') {
      if (!normalizedEmail.endsWith('@iitp.ac.in')) {
        return NextResponse.json({ 
          error: 'Only @iitp.ac.in email addresses are allowed for this registration' 
        }, { status: 400 });
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await setOTP(normalizedEmail, otp);

    await sendOTPEmail({ 
      email: normalizedEmail, 
      otp, 
      event: template.name 
    });

    return NextResponse.json({ 
      success: true, 
      message: 'OTP sent successfully',
      expiresIn: 330 // seconds
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
