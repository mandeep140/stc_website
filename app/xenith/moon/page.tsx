"use client";
import React, { useState } from "react";
import Modal from "@/components/xenith/Modal";

interface FormData {
  SunKey: string;
  email: string;
  name: string;
  teamName: string;
}

export default function Moon() {
  const [formData, setFormData] = useState<FormData>({
    SunKey: "",
    name: "",
    teamName: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!formData.SunKey || !formData.name || !formData.teamName || !formData.email) {
      setError("All fields are required");
      return;
    }
    
    if (!/^[^@\s]+@iitp\.ac\.in$/i.test(formData.email)) {
      setError("Please use your IITP email address");
      return;
    }
    
    setLoading(true);

    try {
      const response = await fetch('/api/xenith/Moon/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      
      setGeneratedKey(data.key);
      setShowSuccessModal(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{ background: "#0f172a" }}
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-yellow-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-1/4 w-[150%] h-[150%] bg-yellow-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/4 left-1/4 w-[120%] h-[120%] bg-yellow-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-4xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <img src="/images/stc-logo.jpg" className="w-12 h-12 rounded-full" alt="STC Logo" />
              <div className="h-8 w-px bg-white/20"></div>
              <img src="/xenith/logo.png" className="w-12 h-12 object-contain" alt="Xenith Logo" />
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
            <div className="flex flex-col gap-6 justify-center">
              <div className="rounded-xl p-6 bg-gradient-to-br from-amber-500/8 to-yellow-400/6 border border-white/6">
                <div className="text-sm text-amber-300 font-semibold uppercase">
                  Level 2 • Moon
                </div>
                <h2 className="mt-3 text-2xl md:text-3xl font-bold text-white">
                  Continue your journey
                </h2>
                <p className="mt-2 text-sm text-slate-200">
                  Enter your details to get your Level 2 key.
                </p>
              </div>
              <div className="h-1 w-full bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80"></div>
            </div>

            <div className="flex flex-col justify-center">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm text-slate-200 mb-1">
                    Level 1 Key
                  </label>
                  <input
                    type="text"
                    name="SunKey"
                    value={formData.SunKey}
                    onChange={handleChange}
                    className="w-full rounded-xl px-4 py-3 bg-white/5 border border-white/6 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    required
                    placeholder="XEN-1-XXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-200 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-xl px-4 py-3 bg-white/5 border border-white/6 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    required
                    placeholder="Your full name"
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
                    className="w-full rounded-xl px-4 py-3 bg-white/5 border border-white/6 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    required
                    placeholder="Your team name"
                  />
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
                    className="w-full rounded-xl px-4 py-3 bg-white/5 border border-white/6 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    required
                    placeholder="name_roll@iitp.ac.in"
                    pattern="[^@\s]+@iitp\.ac\.in$"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Must be your IITP email address
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold shadow hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Get Level 2 Key'}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>

      {/* Success Modal */}
      <Modal
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Level 2 Key Generated!"
        subtitle="Your key has been successfully generated. Keep it safe for the next level."
        keyValue={generatedKey}
        level={2}
      />
    </div>
  );
}