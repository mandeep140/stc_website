import nodemailer, { Transporter } from 'nodemailer';

// Validate required environment variables
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

if (!emailUser || !emailPass) {
  console.error('❌ Email configuration error:');
  if (!emailUser) console.error('   - EMAIL_USER is not set in environment variables');
  if (!emailPass) console.error('   - EMAIL_PASS is not set in environment variables');
  console.error('Please set these variables in your .env.local file');
  throw new Error('Email configuration is incomplete');
}

const transporter: Transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
  },
});

// Verify connection configuration
const verifyTransporter = async (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    // Use the callback-based verify method which is available on the SMTP transport
    transporter.verify((error: Error | null) => {
      if (error) {
        console.error('❌ Error with email configuration:', error);
        reject(new Error(`Failed to verify email configuration: ${error.message}`));
      } else {
        console.log('✅ Email server is ready to send messages');
        resolve(true);
      }
    });
  });
};

// Run verification (but don't block the application)
verifyTransporter().catch(console.error);

interface SendOTPEmailParams {
  email: string;
  otp: string;
  event?: string;
}

export async function sendOTPEmail({ email, otp, event }: SendOTPEmailParams) {
  const mailOptions = {
    from: {
      name: 'STC IITP Hybrid Programs',
      address: process.env.EMAIL_USER || '',
    },
    to: email,
    subject: `${otp} is your verification code for STC IITP Registration`,
    headers: {
      'X-Priority': '1',
      'X-MSMail-Priority': 'High',
      'X-Mailer': 'STC IITP Registration System',
      'List-Unsubscribe': `<mailto:${process.env.EMAIL_USER}?subject=unsubscribe>`,
    },
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>OTP Verification</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 30px 40px; background: linear-gradient(135deg, #0f2a4d 0%, #1a4b8c 100%); border-radius: 10px 10px 0 0;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; text-align: center;">
                        Student Technical Council
                      </h1>
                      <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 14px; text-align: center;">
                        IIT Patna - Official Verification Email
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Body -->
                  <tr>
                    <td style="padding: 40px 40px 30px 40px;">
                      <h2 style="margin: 0 0 20px 0; color: #0f2a4d; font-size: 24px; font-weight: 600;">
                        Email Verification Required
                      </h2>
                      <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                        Dear Student,
                      </p>
                      <p style="margin: 0 0 30px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                        You have initiated a registration${event ? ` for <strong>${event}</strong>` : ''} with the Student Technical Council at IIT Patna. Please verify your email address using the code below:
                      </p>
                      
                      <!-- OTP Box -->
                      <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 30px 0;">
                        <tr>
                          <td align="center" style="padding: 30px; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 8px; border: 2px dashed #1a4b8c;">
                            <div style="font-size: 36px; font-weight: 700; color: #0f2a4d; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                              ${otp}
                            </div>
                            <p style="margin: 15px 0 0 0; color: #1a4b8c; font-size: 14px; font-weight: 500;">
                              Enter this code to verify your email
                            </p>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Important Notice -->
                      <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 20px 0; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                        <tr>
                          <td style="padding: 15px 20px;">
                            <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                              <strong>⚠️ Security Notice:</strong> This verification code expires in <strong>5 minutes</strong>. Never share this code with anyone. STC IITP will never ask for this code via phone or email.
                            </p>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                        If you did not initiate this registration, please disregard this email. Your account remains secure.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 10px 10px; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 13px; text-align: center; line-height: 1.5;">
                        This is an official automated email from Student Technical Council, IIT Patna.
                      </p>
                      <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
                        © 2025 Student Technical Council, IIT Patna. All rights reserved.
                      </p>
                      <p style="margin: 10px 0 0 0; color: #9ca3af; font-size: 12px; text-align: center;">
                        Indian Institute of Technology Patna, Bihar 801106
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    text: `
Student Technical Council Hybrid, IIT Patna - Email Verification

Dear Student,

You have initiated a registration with the Student Technical Council Hybrid at IIT Patna.

Your verification code is: ${otp}

This code is valid for 5 minutes only.

SECURITY NOTICE: Never share this code with anyone. STC IITP will never ask for this code via phone or email.

If you did not initiate this registration, please disregard this email.

Best regards,
STC Hybrid
Indian Institute of Technology Patna
Bihar 801106

This is an official automated email. Please do not reply.
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', (info as { messageId: string }).messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

interface SendConfirmationEmailParams {
  email: string;
  name: string;
  eventTitle: string;
  eventDate: string;
}

export async function sendConfirmationEmail({ email, name, eventTitle, eventDate }: SendConfirmationEmailParams) {
  const mailOptions = {
    from: {
      name: 'STC IITP Hybrid Programs',
      address: process.env.EMAIL_USER || '',
    },
    to: email,
    subject: `Registration Confirmed: ${eventTitle}`,
    headers: {
      'X-Priority': '1',
      'X-MSMail-Priority': 'High',
      'X-Mailer': 'STC IITP Registration System',
    },
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Registration Confirmation</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 30px 40px; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); border-radius: 10px 10px 0 0;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; text-align: center;">
                        ✓ Registration Confirmed!
                      </h1>
                      <p style="margin: 10px 0 0 0; color: #dcfce7; font-size: 14px; text-align: center;">
                        Student Technical Council - IIT Patna
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Body -->
                  <tr>
                    <td style="padding: 40px 40px 30px 40px;">
                      <h2 style="margin: 0 0 20px 0; color: #0f2a4d; font-size: 24px; font-weight: 600;">
                        Hello ${name}! 👋
                      </h2>
                      <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                        Your registration has been successfully confirmed for:
                      </p>
                      
                      <!-- Event Details Box -->
                      <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 30px 0;">
                        <tr>
                          <td style="padding: 25px; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 8px; border-left: 4px solid #1a4b8c;">
                            <h3 style="margin: 0 0 10px 0; color: #0f2a4d; font-size: 20px; font-weight: 600;">
                              ${eventTitle}
                            </h3>
                            <p style="margin: 0; color: #1a4b8c; font-size: 16px; font-weight: 500;">
                              📅 ${eventDate}
                            </p>
                          </td>
                        </tr>
                      </table>
                      
                      <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 15px; border-radius: 4px; margin-bottom: 25px;">
                        <p style="margin: 0; color: #166534; font-size: 14px; font-weight: 500;">
                          ✓ Your spot has been reserved successfully
                        </p>
                      </div>
                      
                      <h3 style="margin: 0 0 15px 0; color: #0f2a4d; font-size: 18px; font-weight: 600;">
                        What's Next?
                      </h3>
                      <ul style="margin: 0 0 25px 0; padding-left: 20px; color: #4b5563; font-size: 15px; line-height: 1.8;">
                        <li>Keep this email for your records</li>
                        <li>Mark your calendar for the event date</li>
                        <li>Watch for any updates or additional information via email</li>
                        <li>Join on time to make the most of this opportunity</li>
                      </ul>
                      
                      <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin-bottom: 25px;">
                        <p style="margin: 0; color: #92400e; font-size: 13px;">
                          <strong>Note:</strong> If you need to cancel your registration or have any queries, please contact the organizers as soon as possible.
                        </p>
                      </div>
                      
                      <p style="margin: 0 0 10px 0; color: #4b5563; font-size: 15px; line-height: 1.6;">
                        We look forward to seeing you at the event!
                      </p>
                      <p style="margin: 0; color: #4b5563; font-size: 15px; line-height: 1.6;">
                        Best regards,<br>
                        <strong>Student Technical Council</strong><br>
                        IIT Patna
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 10px 10px; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 13px; text-align: center; line-height: 1.5;">
                        This is an official confirmation email from Student Technical Council, IIT Patna.
                      </p>
                      <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
                        © 2025 Student Technical Council, IIT Patna. All rights reserved.
                      </p>
                      <p style="margin: 10px 0 0 0; color: #9ca3af; font-size: 12px; text-align: center;">
                        Indian Institute of Technology Patna, Bihar 801106
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    text: `
Registration Confirmed!

Hello ${name},

Your registration has been successfully confirmed for:

Event: ${eventTitle}
Date: ${eventDate}

✓ Your spot has been reserved successfully

What's Next?
- Keep this email for your records
- Mark your calendar for the event date
- Watch for any updates or additional information via email
- Join on time to make the most of this opportunity

Note: If you need to cancel your registration or have any queries, please contact the organizers as soon as possible.

We look forward to seeing you at the event!

Best regards,
STC Hybrid
Indian Institute of Technology Patna
Bihar 801106

This is an official confirmation email. Please do not reply.
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent successfully:', (info as { messageId: string }).messageId);
    return info;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw error;
  }
}

export async function sendXenithOTP({ email, otp, level }: { email: string; otp: string; level: number }) {
  const mailOptions = {
    from: {
      name: 'Xenith - STC IITP',
      address: process.env.EMAIL_USER || '',
    },
    to: email,
    subject: `Xenith Level ${level} - OTP Verification`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Xenith OTP Verification</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  <tr>
                    <td style="padding: 40px 40px 30px 40px; background: linear-gradient(135deg, #0f2a4d 0%, #1a4b8c 100%); border-radius: 10px 10px 0 0;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; text-align: center;">
                        Xenith - Level ${level} Verification
                      </h1>
                      <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 14px; text-align: center;">
                        Student Technical Council, IIT Patna
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px 40px 30px 40px;">
                      <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                        Hello Xenith Participant,
                      </p>
                      <p style="margin: 0 0 30px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                        Your OTP for Xenith Level ${level} verification is:
                      </p>
                      
                      <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 30px 0;">
                        <tr>
                          <td align="center" style="padding: 30px; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 8px; border: 2px dashed #1a4b8c;">
                            <div style="font-size: 36px; font-weight: 700; color: #0f2a4d; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                              ${otp}
                            </div>
                            <p style="margin: 15px 0 0 0; color: #1a4b8c; font-size: 14px; font-weight: 500;">
                              This OTP is valid for 5 minutes
                            </p>
                          </td>
                        </tr>
                      </table>
                      
                      <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 20px 0; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                        <tr>
                          <td style="padding: 15px 20px;">
                            <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                              <strong>⚠️ Security Notice:</strong> Never share this OTP with anyone. STC IITP will never ask for this code via phone or email.
                            </p>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                        If you did not request this OTP, please ignore this email or contact support.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 10px 10px; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 13px; text-align: center; line-height: 1.5;">
                        This is an official automated email from Student Technical Council, IIT Patna.
                      </p>
                      <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
                        © 2025 Student Technical Council, IIT Patna. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    text: `
Xenith - Level ${level} Verification
===================================

Hello Xenith Participant,

Your OTP for Xenith Level ${level} verification is:

${otp}

This OTP is valid for 5 minutes.

SECURITY NOTICE: Never share this OTP with anyone. STC IITP will never ask for this code via phone or email.

If you did not request this OTP, please ignore this email or contact support.

--
Best regards,
STC IITP
Indian Institute of Technology Patna
Bihar 801106

This is an official automated email. Please do not reply.
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Xenith OTP email sent:', (info as { messageId: string }).messageId);
    return info;
  } catch (error) {
    console.error('Error sending Xenith OTP email:', error);
    throw error;
  }
}

export default transporter;
