"use client";
import React, { useState } from "react";
import Modal from "@/components/xenith/Modal";

interface FormData {
  name: string;
  teamName: string;
  email: string;
}

export default function Level1() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    teamName: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [sendingOTP, setSendingOTP] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp] = useState<string[]>(["", "", "", "", "", ""]); // Keep for compatibility with Modal component
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState({
    title: "Level 1 Key Generated!",
    subtitle:
      "Your key has been successfully generated. Keep it safe for the next level.",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validate form data
    if (!formData.name || !formData.teamName || !formData.email) {
      setError("All fields are required");
      return;
    }
    
    if (!/^[^@\s]+@iitp\.ac\.in$/i.test(formData.email)) {
      setError("Please use your IITP email address");
      return;
    }
    
    // Submit the form directly
    await handleRegistration();
  };

  // OTP verification removed as per requirements

  const handleRegistration = async () => {
    setSendingOTP(true);
    setError("");

    try {
      console.log('Sending registration request...');
      const response = await fetch("/api/xenith/level1/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          teamName: formData.teamName,
          email: formData.email
        }),
      });

      const data = await response.json();
      console.log('Registration response:', data);

      // Handle non-200 responses
      if (!response.ok) {
        // Handle validation errors
        if (response.status === 400 && data.missingFields) {
          const missingFields = Object.entries(data.missingFields)
            .filter(([_, isMissing]) => isMissing)
            .map(([field]) => field)
            .join(', ');
          throw new Error(`Please fill in all required fields: ${missingFields}`);
        }
        
        // Handle other error responses
        throw new Error(data.error || data.message || "Registration failed. Please try again.");
      }

      // Handle successful response
      if (data.success) {
        const isExistingUser = data.existing || false;
        setSuccessMessage({
          title: isExistingUser ? "Welcome Back!" : "Level 1 Key!",
          subtitle: isExistingUser
            ? "Here is your existing key. Keep it safe for the next level."
            : "Your key has been successfully generated. Keep it safe for the next level.",
        });

        const userKey = data.key || data.level1Key;
        if (!userKey) {
          console.error('No key found in response:', data);
          throw new Error("Failed to generate key. Please contact support.");
        }

        setGeneratedKey(userKey);
        setShowSuccessModal(true);
        setError("");
      } else {
        throw new Error(data.error || "Registration was not successful. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      
      // Handle different types of errors
      let errorMessage = "Registration failed. Please try again.";
      
      if (err instanceof Error) {
        // Handle network errors
        if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
          errorMessage = "Network error. Please check your connection and try again.";
        } 
        // Handle API error responses
        else if (err.message) {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setSendingOTP(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{ background: "#0f172a" }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-yellow-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-1/4 w-[150%] h-[150%] bg-yellow-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/4 left-1/4 w-[120%] h-[120%] bg-yellow-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-4xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <img
                src="/images/stc-logo.jpg"
                className="w-12 h-12 rounded-full"
                alt="STC Logo"
              />
              <div className="h-8 w-px bg-white/20"></div>
              <img
                src="/xenith/logo.png"
                className="w-12 h-12 object-contain"
                alt="Xenith Logo"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]">
              Treasure Hunt
            </h1>
            <p className="mt-2 text-sm text-slate-300">
              Decipher the clues and navigate through challenges to advance.
            </p>
          </div>
        </header>

        <main className="bg-gradient-to-br from-white/3 to-transparent rounded-3xl p-8 md:p-12 ring-1 ring-white/6 backdrop-blur-sm shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-6">
              <div className="rounded-xl p-6 bg-gradient-to-br from-amber-500/10 to-yellow-400/8 border border-white/6 backdrop-blur-sm shadow-lg hover:shadow-amber-500/10 transition-all duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-base font-semibold text-amber-300">
                    Level 1 • The Beginning
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                    <p className="text-sm text-slate-200 mb-2">
                      <span className="font-medium text-amber-200">
                        Important
                      </span>{" "}
                      Your key will be shown after successful registration.
                    </p>
                    <div className="flex items-start gap-2">
                      <svg
                        className="w-4 h-4 mt-0.5 text-amber-400 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-xs text-slate-400">
                        Your key will be required to access Level 2.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
            </div>

            <div className="flex flex-col justify-center">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-200 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-xl px-4 py-3 bg-white/5 border border-white/6 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-400"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-200 mb-1">
                      Team Name
                    </label>
                    <input
                      type="text"
                      name="teamName"
                      value={formData.teamName}
                      onChange={handleChange}
                      className="w-full rounded-xl px-4 py-3 bg-white/5 border border-white/6 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-400"
                      placeholder="Enter your team name"
                      minLength={3}
                      maxLength={50}
                      required
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      3-50 characters
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-200 mb-1">
                    IITP Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-xl px-4 py-3 bg-white/5 border border-white/6 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-400"
                    placeholder="name_roll@iitp.ac.in"
                    pattern="[^@\s]+@iitp\.ac\.in$"
                    required
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Must be your official IITP email.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={sendingOTP || !formData.email || !formData.name || !formData.teamName}
                    className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all flex items-center justify-center gap-2 ${
                      sendingOTP || !formData.email || !formData.name || !formData.teamName
                        ? "bg-slate-600 cursor-not-allowed text-slate-400"
                        : "bg-amber-500 text-white hover:bg-amber-600"
                    }`}
                  >
                    {sendingOTP ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Registering...
                      </>
                    ) : (
                      'Register'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>

        <footer className="mt-8 text-sm text-slate-400 flex justify-between">
          <div>Tech Hunt • {new Date().getFullYear()}</div>
          <div className="hidden sm:block">Play fair. Good luck.</div>
        </footer>

        <Modal
          open={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title={successMessage.title}
          subtitle={successMessage.subtitle}
          keyValue={generatedKey}
          level={1}
        />
      </div>
    </div>
  );
}
