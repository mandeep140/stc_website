import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/connectdb';
import RegistrationTemplate from '@/schema/RegistrationTemplateSchema';
import RegistrationSubmission from '@/schema/RegistrationSubmissionSchema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { registrationSlug, data, emailVerified, password } = body;

    if (!registrationSlug || !data) {
      return NextResponse.json({ error: 'Registration slug and data are required' }, { status: 400 });
    }

    await connectDB();

    const template = await RegistrationTemplate.findOne({ slug: registrationSlug, active: true });
    
    if (!template) {
      return NextResponse.json({ error: 'Registration form not found or inactive' }, { status: 404 });
    }

    // Check password protection
    if (template.passwordProtected) {
      if (!password) {
        return NextResponse.json({ error: 'Password is required for this form' }, { status: 400 });
      }
      if (password !== template.password) {
        return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
      }
    }

    const errors: { [key: string]: string } = {};
    
    template.fields.forEach((field: any) => {
      const value = data[field.key];
      
      if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
        errors[field.key] = `${field.label} is required`;
        return;
      }

      if (!value) return;

      if (field.validation) {
        if (typeof value === 'string') {
          if (field.validation.minLength && value.length < field.validation.minLength) {
            errors[field.key] = field.validation.customMessage || 
              `${field.label} must be at least ${field.validation.minLength} characters`;
          }
          if (field.validation.maxLength && value.length > field.validation.maxLength) {
            errors[field.key] = field.validation.customMessage || 
              `${field.label} must be at most ${field.validation.maxLength} characters`;
          }
        }

        if (field.type === 'number') {
          const numValue = Number(value);
          if (field.validation.min !== undefined && numValue < field.validation.min) {
            errors[field.key] = `${field.label} must be at least ${field.validation.min}`;
          }
          if (field.validation.max !== undefined && numValue > field.validation.max) {
            errors[field.key] = `${field.label} must be at most ${field.validation.max}`;
          }
        }

        if (field.validation.pattern && typeof value === 'string') {
          const regex = new RegExp(field.validation.pattern);
          if (!regex.test(value)) {
            errors[field.key] = field.validation.customMessage || `Invalid ${field.label} format`;
          }
        }
      }

      if (field.type === 'email' && field.emailRestriction === 'iitp') {
        if (!value.toLowerCase().endsWith('@iitp.ac.in')) {
          errors[field.key] = 'Only @iitp.ac.in email addresses are allowed';
        }
      }
    });

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: 'Validation failed', errors }, { status: 400 });
    }

    // Check for duplicate submission (same email, same form)
    const emailField = template.fields.find((f: any) => f.type === 'email');
    if (emailField && data[emailField.key]) {
      const existingSubmission = await RegistrationSubmission.findOne({
        registrationSlug,
        [`data.${emailField.key}`]: data[emailField.key]
      });

      if (existingSubmission) {
        return NextResponse.json({ 
          error: 'You have already submitted this registration form with this email address.' 
        }, { status: 400 });
      }
    }

    const submission = await RegistrationSubmission.create({
      registrationTemplateId: template._id,
      registrationSlug,
      data,
      metadata: {
        emailVerified: emailVerified || false,
        verifiedAt: emailVerified ? new Date() : undefined
      }
    });

    return NextResponse.json({ 
      success: true, 
      submissionId: submission._id,
      message: 'Registration submitted successfully' 
    }, { status: 201 });
  } catch (error) {
    console.error('Error submitting registration:', error);
    return NextResponse.json({ error: 'Failed to submit registration' }, { status: 500 });
  }
}
