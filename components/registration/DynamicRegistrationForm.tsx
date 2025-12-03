"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, AlertCircle } from 'lucide-react';
import { uploadToImageKit } from '@/lib/imagekit';
import Link from 'next/link';

interface FieldOption {
  label: string;
  value: string;
}

interface Field {
  key: string;
  label: string;
  type: string;
  placeholder?: string;
  required: boolean;
  important: boolean;
  options?: FieldOption[];
  order: number;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    maxLength?: number;
    minLength?: number;
    customMessage?: string;
  };
  conditional?: {
    fieldKey: string;
    operator: string;
    value: unknown;
  };
  emailRestriction?: 'all' | 'iitp';
  imageFolder?: string;
  maxFileSize?: number;
}

interface Template {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  fields: Field[];
  passwordProtected?: boolean;
  password?: string;
}

interface DynamicRegistrationFormProps {
  slug: string;
}

export default function DynamicRegistrationForm({ slug }: DynamicRegistrationFormProps) {
  const [template, setTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<{ [key: string]: boolean }>({});

  // Password protection states
  const [formPassword, setFormPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    fetchTemplate();
  }, [slug]);

  const fetchTemplate = async () => {
    try {
      const response = await fetch(`/api/registration/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setTemplate(data);

        const initialData: Record<string, unknown> = {};
        data.fields.forEach((field: Field) => {
          if (field.type === 'checkbox') {
            initialData[field.key] = [];
          } else {
            initialData[field.key] = '';
          }
        });
        setFormData(initialData);

        // Find email field
        const _emailFld = data.fields.find((f: Field) => f.type === 'email');
      }
    } catch (error) {
      console.error('Error fetching template:', error);
    } finally {
      setLoading(false);
    }
  };

  // const sendOTP = async () => {
  //   if (!emailField || !formData[emailField.key]) {
  //     if (emailField) {
  //       setErrors({ ...errors, [emailField.key]: 'Email is required for verification' });
  //     }
  //     return;
  //   }

  //   const email = formData[emailField.key];

  //   // Validate email domain if restricted
  //   if (emailField.emailRestriction === 'iitp' && !email.toLowerCase().endsWith('@iitp.ac.in')) {
  //     setErrors({ ...errors, [emailField.key]: 'Only @iitp.ac.in email addresses are allowed' });
  //     return;
  //   }

  //   setSendingOtp(true);
  //   const trimmedEmail = email.trim().toLowerCase();
  //   setOtpEmail(trimmedEmail);

  //   try {
  //     const response = await fetch('/api/registration/send-otp', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         email: trimmedEmail,
  //         registrationSlug: slug
  //       })
  //     });

  //     if (response.ok) {
  //       setOtpSent(true);
  //       setOtpTimer(330); // 5 minutes 30 seconds
  //       setErrors({ ...errors, [emailField.key]: '' });
  //       setShowOtpSentModal(true);
  //     } else {
  //       const error = await response.json();
  //       setErrors({ ...errors, [emailField.key]: error.error });
  //     }
  //   } catch (error) {
  //     console.error('Error sending OTP:', error);
  //     setErrors({ ...errors, [emailField.key]: 'Failed to send OTP' });
  //   } finally {
  //     setSendingOtp(false);
  //   }
  // };

  // const verifyOTP = async () => {
  //   if (!emailField || !otp) {
  //     return;
  //   }

  //   setVerifyingOtp(true);
  //   try {
  //     const response = await fetch('/api/registration/verify-otp', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         email: formData[emailField.key]?.trim().toLowerCase(),
  //         otp: otp.trim()
  //       })
  //     });

  //     if (response.ok) {
  //       setOtpVerified(true);
  //       setOtpSent(false);
  //       setOtp('');
  //     } else {
  //       const error = await response.json();
  //       alert(error.error);
  //     }
  //   } catch (error) {
  //     console.error('Error verifying OTP:', error);
  //     alert('Failed to verify OTP');
  //   } finally {
  //     setVerifyingOtp(false);
  //   }
  // };

  const shouldShowField = (field: Field): boolean => {
    // Check if this is a team member field
    const teamSizeMatch = field.key.match(/^member-(\d+)-/);
    if (teamSizeMatch) {
      const memberNumber = parseInt(teamSizeMatch[1]);
      const teamSize = formData['hackathon-team-field'];

      // Only show member fields up to the selected team size
      if (!teamSize || memberNumber > parseInt(String(teamSize))) {
        return false;
      }
    }

    // Check conditional logic
    if (!field.conditional) return true;

    const { fieldKey, operator, value } = field.conditional;
    const fieldValue = formData[fieldKey];

    // If the parent field hasn't been filled yet, don't show this field
    if (fieldValue === '' || fieldValue === null || fieldValue === undefined) {
      return false;
    }

    switch (operator) {
      case '==':
        return String(fieldValue) === String(value);
      case '!=':
        return String(fieldValue) !== String(value);
      case 'in':
        // For checkbox fields (arrays)
        if (Array.isArray(fieldValue)) {
          return fieldValue.includes(value);
        }
        // For other fields, check if value contains the string
        return String(fieldValue).includes(String(value));
      case 'notin':
        if (Array.isArray(fieldValue)) {
          return !fieldValue.includes(value);
        }
        return !String(fieldValue).includes(String(value));
      case '>':
        return Number(fieldValue) > Number(value);
      case '<':
        return Number(fieldValue) < Number(value);
      default:
        return true;
    }
  };

  const handleChange = (key: string, value: unknown) => {
    setFormData({ ...formData, [key]: value });
    if (errors[key]) {
      setErrors({ ...errors, [key]: '' });
    }
  };

  const handleCheckboxChange = (key: string, value: string, checked: boolean) => {
    const currentValues = (formData[key] as string[]) || [];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter((v: string) => v !== value);
    handleChange(key, newValues);
  };

  const handleImageUpload = async (key: string, file: File, field: Field) => {
    if (!file) return;

    const maxSize = (field.maxFileSize || 5) * 1024 * 1024; // Convert MB to bytes
    if (file.size > maxSize) {
      setErrors({ ...errors, [key]: `File size must be less than ${field.maxFileSize || 5}MB` });
      return;
    }

    setUploadingImages({ ...uploadingImages, [key]: true });
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const result = await uploadToImageKit(file, fileName);
      handleChange(key, result.url);
      setErrors({ ...errors, [key]: '' });
    } catch (error) {
      console.error('Image upload error:', error);
      setErrors({ ...errors, [key]: 'Failed to upload image' });
    } finally {
      setUploadingImages({ ...uploadingImages, [key]: false });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    template?.fields.forEach((field) => {
      if (!shouldShowField(field)) return;

      const value = formData[field.key];

      if (field.required && !value) {
        newErrors[field.key] = `${field.label} is required`;
        return;
      }

      // Validate email domain restriction
      if (field.type === 'email' && field.emailRestriction === 'iitp' && value) {
        if (!String(value).toLowerCase().endsWith('@iitp.ac.in')) {
          newErrors[field.key] = 'Only @iitp.ac.in email addresses are allowed';
          return;
        }
      }

      if (value && field.validation) {
        const valueStr = String(value);
        if (field.validation.minLength && valueStr.length < field.validation.minLength) {
          newErrors[field.key] = field.validation.customMessage || `Minimum length is ${field.validation.minLength}`;
        }
        if (field.validation.maxLength && valueStr.length > field.validation.maxLength) {
          newErrors[field.key] = field.validation.customMessage || `Maximum length is ${field.validation.maxLength}`;
        }
        if (field.validation.pattern) {
          const regex = new RegExp(field.validation.pattern);
          if (!regex.test(String(value))) {
            newErrors[field.key] = field.validation.customMessage || 'Invalid format';
          }
        }
        if (field.type === 'number') {
          const numValue = Number(value);
          if (field.validation.min !== undefined && numValue < field.validation.min) {
            newErrors[field.key] = `Minimum value is ${field.validation.min}`;
          }
          if (field.validation.max !== undefined && numValue > field.validation.max) {
            newErrors[field.key] = `Maximum value is ${field.validation.max}`;
          }
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Password protection check
    if (template?.passwordProtected) {
      if (!formPassword) {
        setPasswordError('Password is required to submit this form');
        return;
      }
      if (formPassword !== template.password) {
        setPasswordError('Incorrect password. Please try again.');
        return;
      }
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/registration/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationSlug: slug,
          data: formData,
          password: template?.passwordProtected ? formPassword : undefined
        })
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({});
        setFormPassword('');
      } else {
        const error = await response.json();
        if (error.errors) {
          setErrors(error.errors);
        } else {
          alert(error.error || 'Failed to submit registration');
        }
      }
    } catch (error) {
      console.error('Error submitting registration:', error);
      alert('Failed to submit registration');
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field: Field) => {
    if (!shouldShowField(field)) return null;

    const commonProps = {
      id: field.key,
      disabled: submitting
    };

    return (
      <div key={field.key} className="space-y-2">
        <Label htmlFor={field.key} className="text-base font-medium leading-relaxed whitespace-pre-wrap block">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
          {field.important && <span className="text-yellow-500 ml-1 font-bold">⚠</span>}
        </Label>

        {/* Image upload field */}
        {field.type === 'image' && (
          <div className="space-y-2">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(field.key, file, field);
              }}
              disabled={submitting || uploadingImages[field.key]}
              className={errors[field.key] ? 'border-red-500' : ''}
            />
            {uploadingImages[field.key] && (
              <div className="flex items-center text-sm text-gray-500">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </div>
            )}
            {Boolean(formData[field.key]) && !uploadingImages[field.key] && (
              <div className="mt-2">
                <img src={String(formData[field.key])} alt="Preview" className="max-w-xs rounded border" />
              </div>
            )}
            <p className="text-xs text-gray-500">Max file size: {field.maxFileSize || 5} MB</p>
          </div>
        )}

        {/* Regular fields */}
        {field.type !== 'email' && field.type !== 'image' && field.type === 'textarea' && (
          <Textarea
            {...commonProps}
            value={String(formData[field.key] ?? '')}
            onChange={(e) => handleChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className={errors[field.key] ? 'border-red-500' : ''}
          />
        )}

        {field.type === 'select' && (
          <Select
            value={String(formData[field.key] ?? '')}
            onValueChange={(value) => handleChange(field.key, value)}
            disabled={submitting}
          >
            <SelectTrigger className={errors[field.key] ? 'border-red-500' : ''}>
              <SelectValue placeholder={field.placeholder || 'Select...'} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {field.type === 'radio' && (
          <RadioGroup
            value={String(formData[field.key] ?? '')}
            onValueChange={(value) => handleChange(field.key, value)}
            disabled={submitting}
          >
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`${field.key}-${option.value}`} />
                <Label htmlFor={`${field.key}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {field.type === 'checkbox' && (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.key}-${option.value}`}
                  checked={((formData[field.key] as string[]) || []).includes(option.value)}
                  onCheckedChange={(checked) => handleCheckboxChange(field.key, option.value, checked as boolean)}
                  disabled={submitting}
                />
                <Label htmlFor={`${field.key}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </div>
        )}

        {field.type === 'email' && (
          <div className="space-y-1">
            <Input
              {...commonProps}
              type="email"
              value={String(formData[field.key] ?? '')}
              onChange={(e) => handleChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className={errors[field.key] ? 'border-red-500' : ''}
            />
            {field.emailRestriction === 'iitp' && (
              <p className="text-xs text-blue-600">Only @iitp.ac.in email addresses are allowed</p>
            )}
          </div>
        )}

        {!['textarea', 'select', 'radio', 'checkbox', 'email', 'image'].includes(field.type) && (
          <Input
            {...commonProps}
            type={field.type}
            value={String(formData[field.key] ?? '')}
            onChange={(e) => handleChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className={errors[field.key] ? 'border-red-500' : ''}
            min={field.validation?.min}
            max={field.validation?.max}
            maxLength={field.validation?.maxLength}
            minLength={field.validation?.minLength}
          />
        )}

        {errors[field.key] && (
          <p className="text-sm text-red-500">{errors[field.key]}</p>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!template) {
    return (
      <Card className="max-w-2xl mx-auto mt-8">
        <CardContent className="pt-6">
          <p className="text-center text-red-500">Registration form not found or inactive</p>
        </CardContent>
      </Card>
    );
  }

  if (submitted) {
    return (
      <Card className="max-w-2xl mx-auto mt-8">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="text-6xl">✓</div>
          <h2 className="text-2xl font-bold text-green-600">Registration Successful!</h2>
          <p className="text-gray-600">Your registration has been submitted successfully.</p>
          <Button onClick={() => { setSubmitted(false); fetchTemplate(); }}>
            Submit Another Registration
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!template) {
    return (
      <Card className="max-w-2xl mx-auto mt-8">
        <CardContent className="pt-6">
          <p className="text-center text-red-500">Registration form not found or inactive</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle>{template.name}</CardTitle>
          {template.description && (
            <CardDescription>{template.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {(() => {
              const sortedFields = [...template.fields].sort((a, b) => a.order - b.order);
              const teamSize = formData['hackathon-team-field'] ? parseInt(String(formData['hackathon-team-field'])) : 0;
              const renderedFields: React.ReactNode[] = [];

              // Group fields by member number
              const memberFieldGroups: { [key: number]: Field[] } = {};
              const regularFields: Field[] = [];

              sortedFields.forEach(field => {
                const memberMatch = field.key.match(/^member-(\d+)-(.+)$/);
                if (memberMatch) {
                  const memberNum = parseInt(memberMatch[1]);
                  if (!memberFieldGroups[memberNum]) {
                    memberFieldGroups[memberNum] = [];
                  }
                  memberFieldGroups[memberNum].push(field);
                } else {
                  regularFields.push(field);
                }
              });

              // Render regular fields first
              regularFields.forEach(field => {
                renderedFields.push(renderField(field));
              });

              // Render team member sections if team size is selected
              if (teamSize > 0) {
                for (let i = 1; i <= teamSize; i++) {
                  const memberFields = memberFieldGroups[i];
                  if (memberFields && memberFields.length > 0) {
                    renderedFields.push(
                      <div key={`member-section-${i}`} className="border rounded-lg p-4 space-y-4 bg-gray-50">
                        {memberFields.map(field => renderField(field))}
                      </div>
                    );
                  }
                }
              }

              return renderedFields;
            })()}

            {/* Password Protection Field */}
            {template.passwordProtected && (
              <div className="border-t pt-6 space-y-3">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-800 mb-1">Password Protected Form</h4>
                      <p className="text-sm text-yellow-700">
                        Please read rulebook or any provided resources to get password.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="formPassword">
                    Form Password <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="formPassword"
                    type="password"
                    value={formPassword}
                    onChange={(e) => {
                      setFormPassword(e.target.value);
                      setPasswordError('');
                    }}
                    placeholder="Enter form password"
                    className={passwordError ? 'border-red-500' : ''}
                    disabled={submitting}
                  />
                  {passwordError && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {passwordError}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Registration'
                )}
              </Button>
            </div>
          </form>
        </CardContent>

        <CardContent className="pt-4 border-t ">
          <p className="text-sm text-gray-600">
            If you are facing any issues, please  <Link href='/contact' className='text-blue-400 underline hover:text-blue-600'>contact us.</Link>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
