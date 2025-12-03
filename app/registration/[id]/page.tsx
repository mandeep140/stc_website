"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Loader2, Calendar, ArrowLeft, FileText } from "lucide-react";
import { toIndianDateString } from "@/lib/formatDate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import DynamicRegistrationForm from "@/components/registration/DynamicRegistrationForm";

interface RegistrationTemplate {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  fields: { key: string; type: string; label: string }[];
  active: boolean;
  emailRestriction: "all" | "iitp";
  createdAt: string;
}

export default function RegistrationFormPage() {
  const params = useParams();
  const slug = params.id as string;

  const [template, setTemplate] = useState<RegistrationTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await fetch(`/api/registration/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setTemplate(data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching form:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#1a4b8c]" />
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Form Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            This registration form does not exist or is no longer available.
          </p>
          <Link href="/registration">
            <Button className="bg-[#0f2a4d] hover:bg-[#1a4b8c]">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Registrations
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/registration">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Forms
            </Button>
          </Link>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Form Details */}
          <div className="lg:col-span-1 space-y-6">
            {template.image && (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-xl">
                <Image
                  src={template.image}
                  alt={template.name}
                  fill
                  className="object-contain bg-gray-50"
                  unoptimized
                />
              </div>
            )}
            <Card className="p-6 sticky top-24 shadow-xl">
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-[#0f2a4d] mb-3">
                    {template.name}
                  </h1>
                  <p className="text-gray-600 leading-relaxed">
                    {template.description}
                  </p>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-3 text-[#1a4b8c]" />
                  <span>Created {toIndianDateString(template.createdAt)}</span>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-[#0f2a4d] mb-2 text-sm">
                      📋 Instructions
                    </h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Fill all required fields</li>
                      <li>• Verify your email with OTP</li>
                      <li>• Review before submitting</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Side - Registration Form */}
          <div className="lg:col-span-2">
            <DynamicRegistrationForm slug={slug} />
          </div>
        </div>
      </div>
    </div>
  );
}
