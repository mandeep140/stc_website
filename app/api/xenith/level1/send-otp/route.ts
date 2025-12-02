import { NextResponse } from 'next/server';
import { setOTP } from '@/lib/redis';
import nodemailer from 'nodemailer';

// Validate environment variables
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

if (!emailUser || !emailPass) {
  console.error('Missing email configuration. Please set EMAIL_USER and EMAIL_PASS in .env');
  process.exit(1);
}

// Configure Nodemailer with Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/^[^@\s]+@iitp\.ac\.in$/i.test(email)) {
      return NextResponse.json(
        { error: 'Please use your IITP email address' },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    
    try {
      // Store OTP in Redis with 10 minute expiration
      await setOTP(email, otp);
      console.log(`OTP generated for ${email}`);

      // Send email with OTP using Nodemailer
      await transporter.sendMail({
        from: `"Xenith IITP" <${emailUser}>`,
        to: email,
        subject: 'Your OTP for Xenith',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #f59e0b;">Xenith OTP Verification</h2>
            <p>Your OTP is: <strong>${otp}</strong></p>
            <p>This OTP is valid for 10 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
              This is an automated message from Xenith IITP. Please do not reply to this email.
            </p>
          </div>
        `,
      });

      console.log('OTP email sent to:', email);

      return NextResponse.json({ 
        success: true, 
        message: 'OTP sent successfully' 
      });

    } catch (error) {
      console.error('Error in OTP process:', error);
      return NextResponse.json(
        { error: 'Failed to send OTP email. Please try again later.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error in send-otp endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}