"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Loader2, Calendar, Users, ArrowRight } from "lucide-react";
import { toIndianDateString } from "@/lib/formatDate";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import Link from "next/link";

interface RegistrationForm {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  fields: { key: string; type: string }[];
  active: boolean;
  createdAt: string;
}

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<RegistrationForm[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRegistrations();
  },);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch("/api/admin/registration-templates");
      if (response.ok) {
        const data = await response.json();
        // Only show active forms
        const activeForms = data.filter(
          (form: RegistrationForm) => form.active
        );
        setRegistrations(activeForms);
      }
    } catch (error) {
      console.error("Error fetching registrations:", error);
      toast({
        title: "Error",
        description: "Failed to fetch registration forms",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-25 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-[#0f2a4d] mb-4">
            Open Registrations
          </h1>
          <p className="text-xl text-[#1a4b8c] max-w-2xl mx-auto">
            Register for upcoming events and workshops
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-[#1a4b8c]" />
          </div>
        ) : registrations.length === 0 ? (
          <Card className="max-w-2xl mx-auto shadow-xl">
            <CardContent className="py-20 text-center">
              <Users className="w-20 h-20 mx-auto mb-6 text-gray-300" />
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                No Active Registrations
              </h3>
              <p className="text-lg text-gray-500">
                Check back later for upcoming events!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {registrations.map((form) => (
              <Card
                key={form._id}
                className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-[#1a4b8c]"
              >
                {form.image && (
                  <div className="relative w-full aspect-video bg-gray-50">
                    <Image
                      src={form.image}
                      alt={form.name}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                )}
                <CardHeader className="pb-3 pt-6">
                  <h3 className="text-2xl font-bold text-[#0f2a4d] line-clamp-2 min-h-[3.5rem]">
                    {form.name}
                  </h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-gray-600 line-clamp-4 min-h-[6rem] leading-relaxed">
                    {form.description}
                  </p>

                  <div className="space-y-2 pt-3 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="line-clamp-1">
                        Created {toIndianDateString(form.createdAt)}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gradient-to-r from-[#0f2a4d] to-[#1a4b8c] p-0">
                  <Link href={`/registration/${form.slug}`} className="w-full">
                    <Button className="w-full h-14 text-white bg-transparent hover:bg-white/10 text-base font-semibold rounded-none">
                      Register Now
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
