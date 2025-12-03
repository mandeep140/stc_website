"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Modal from "../../../components/xenith/Modal";

export default function Level2() {
  const [level1Key, setLevel1Key] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [verifyEmail, setVerifyEmail] = useState("");
  const [sendingOTP, setSendingOTP] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [verifyingOTP, setVerifyingOTP] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [level2Key, setLevel2Key] = useState("");
  const [copied, setCopied] = useState(false);
  const [completed, setCompleted] = useState(false);
  const router = useRouter();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If OTP is entered, verify it
    if (otpSent && otp.every(digit => digit) && otp.length === 6) {
      await handleOTPVerify(otp.join(''));
      return;
    }

    // If resending OTP, reset state
    if (otpSent && otp.every(digit => !digit)) {
      setOtpSent(false);
      setOtp(['', '', '', '', '', '']);
      setError('');
      return;
    }

    setLoading(true);
    setError("");

    try {
      // First, verify the level1 key
      const response = await fetch('/api/xenith/level2/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level1Key })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      setEmail(data.email);
      setOtpModalOpen(true);
      setOtpSent(true);
      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Verification failed';
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.some(digit => !digit)) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }
    await handleOTPVerify(otp.join(''));
  };

  const handleSendOTP = async () => {
    if (!verifyEmail.trim()) {
      setError("Please enter your email first.");
      return;
    }

    if (!/^[^@\s]+@iitp\.ac\.in$/.test(verifyEmail)) {
      setError("Please enter a valid IITP email (name_roll@iitp.ac.in).");
      return;
    }

    setSendingOTP(true);
    setError("");

    try {
      const response = await fetch('/api/xenith/level2/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: verifyEmail })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      setOtpSent(true);
      setEmail(verifyEmail);
    } catch (err) {
      console.error('Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to send OTP';
      setError(errorMessage);
    } finally {
      setSendingOTP(false);
    }
  };

  const handleOTPVerify = async (otpValue: string) => {
    setVerifyingOTP(true);
    setError("");
    try {
      const response = await fetch('/api/xenith/level2/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email || verifyEmail, otp: otpValue })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      // Store the key and show success modal
      setLevel2Key(data.level2Key);
      setOtpModalOpen(false); // Close the OTP modal
      setOtp(['', '', '', '', '', '']); // Reset OTP input
      setCompleted(true); // Show success screen
    } catch (err) {
      console.error('Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Verification failed';
      setError(errorMessage);
    } finally {
      setVerifyingOTP(false);
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
              <img src="/images/stc-logo.jpg" className="w-12 h-12 rounded-full" />
              <div className="h-8 w-px bg-white/20"></div>
              <img src="/xenith/logo.png" className="w-12 h-12 object-contain" />
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
                  Level 2 • Route
                </div>
                <h2 className="mt-3 text-2xl md:text-3xl font-bold text-white">
                  Continue your journey
                </h2>
                <p className="mt-2 text-sm text-slate-200">
                  Enter your Level 1 key to claim your key for Level 3.
                </p>

                <div className="mt-6 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-white/6 flex items-center justify-center text-amber-300 font-bold text-lg">
                    2
                  </div>
                  <div className="text-sm text-slate-300">
                    Keep this key safe - required for Level 3.
                  </div>
                </div>
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
                    id="level1Key"
                    value={level1Key}
                    onChange={(e) => setLevel1Key(e.target.value)}
                    className="w-full rounded-xl px-4 py-3 bg-white/5 border border-white/6 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-400 focus:border-transparent text-white"
                    required
                    placeholder="XEN-1-XXXXXX"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Enter the key you received from Level 1.
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-slate-200 mb-1">
                    IITP Email (Verify Connection)
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <input
                      type="email"
                      value={verifyEmail}
                      onChange={(e) => {
                        setVerifyEmail(e.target.value);
                        setOtpSent(false);
                      }}
                      className="w-full rounded-xl px-4 py-3 bg-white/5 border border-white/6 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-400"
                      placeholder="name_roll@iitp.ac.in"
                      pattern="[^@\s]+@iitp\.ac\.in$"
                    />
                    <button
                      type="button"
                      onClick={handleSendOTP}
                      disabled={sendingOTP || !verifyEmail.trim()}
                      className="w-full sm:w-auto px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold shadow hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {sendingOTP ? 'Sending...' : otpSent ? '✓ Sent' : 'Send OTP'}
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {otpSent ? 'OTP sent! Check your inbox and junk mail folder for the OTP.' : 'Optional: Verify your email connection.'}
                  </p>
                </div>

                {otpSent && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-slate-200 mb-2 text-center">
                        Enter the 6-digit code sent to {email || verifyEmail}
                      </label>
                      <div className="flex justify-center gap-2 mb-4">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                          <input
                            key={index}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={otp[index] || ''}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '');
                              if (value || e.target.value === '') {
                                const newOtp = [...otp];
                                newOtp[index] = value;
                                setOtp(newOtp);
                                
                                // Auto-focus next input
                                if (value && index < 5) {
                                  const nextInput = document.getElementById(`otp-${index + 1}`);
                                  if (nextInput) nextInput.focus();
                                }
                              }
                            }}
                            onKeyDown={(e) => {
                              // Handle backspace
                              if (e.key === 'Backspace' && !otp[index] && index > 0) {
                                const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
                                if (prevInput) prevInput.focus();
                              }
                            }}
                            id={`otp-${index}`}
                            className="w-12 h-14 text-2xl text-center bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent text-white"
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={handleSendOTP}
                        disabled={sendingOTP}
                        className="text-sm text-amber-400 hover:text-amber-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {sendingOTP ? 'Sending new code...' : 'Resend code'}
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading || verifyingOTP || (otpSent && otp.some(digit => !digit))}
                    onClick={async (e) => {
                      if (otpSent) {
                        if (otp.every(digit => !digit)) {
                          // Resend OTP
                          setOtpSent(false);
                          setOtp(['', '', '', '', '', '']);
                          handleSubmit(e);
                        } else {
                          // Verify OTP
                          e.preventDefault();
                          await handleOTPVerify(otp.join(''));
                        }
                      }
                    }}
                    className="w-full rounded-xl px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold shadow hover:scale-[1.01] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {verifyingOTP ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying...
                      </span>
                    ) : 'Verify & Continue'}
                  </button>
                </div>

                <div className="text-xs text-slate-400 pt-2">
                  Your unique key will be stored securely. Keep it safe for Level 3.
                </div>
              </form>
            </div>
          </div>
        </main>

        <footer className="mt-8 text-sm text-slate-400 flex justify-between">
          <div>Tech Hunt • {new Date().getFullYear()}</div>
          <div className="hidden sm:block">Play fair. Good luck.</div>
        </footer>
      </div>

      {completed ? (
        <div className="fixed inset-0 flex items-center justify-center p-6 bg-[#0f172a] z-50">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-yellow-500/5 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 -right-1/4 w-[150%] h-[150%] bg-yellow-500/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-1/4 left-1/4 w-[120%] h-[120%] bg-yellow-500/5 rounded-full blur-3xl"></div>
          </div>

          <div className="w-full max-w-2xl mx-auto relative z-10">
            <div className="bg-gradient-to-br from-white/3 to-transparent rounded-3xl p-8 md:p-12 ring-1 ring-white/6 backdrop-blur-sm shadow-2xl text-center">
              <div className="text-amber-400 text-6xl mb-6 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">
                ✓
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]">
                Level 2 Completed!
              </h1>
              <p className="text-lg text-slate-300 mb-8">
                You've successfully completed Level 2 of Treasure Hunt!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Compact Key Section */}
                <div className="bg-gradient-to-br from-amber-500/8 to-yellow-400/6 border border-white/6 p-4 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs text-amber-300 font-semibold uppercase">
                      Level 2 Key
                    </p>
                    <button
                      onClick={() => copyToClipboard(level2Key)}
                      className="p-1.5 text-amber-300 hover:text-amber-200 transition-colors rounded-full hover:bg-amber-500/10"
                      title={copied ? "Copied!" : "Copy to clipboard"}
                    >
                      {copied ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      )}
                    </button>
                  </div>
                  <p className="text-lg font-mono break-all text-white truncate" title={level2Key}>
                    {level2Key}
                  </p>
                </div>

                <div className="md:col-span-2 bg-gradient-to-br from-amber-600/10 to-amber-500/5 border border-amber-500/20 p-5 rounded-xl flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="text-amber-400"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    <h3 className="text-amber-300 font-semibold text-lg">Clue for Level 3</h3>
                  </div>
                  <div className="bg-black/20 p-4 rounded-lg border border-amber-500/20 flex-1 flex items-center">
                    <p className="text-amber-100 text-base leading-relaxed">
                      <span className="block mb-2">🔍 <span className="font-medium">The next step lies where the sun rises, but not where it sets.</span></span>
                      <span className="block">🕵️ <span className="font-medium">Look for the path that's often overlooked, where shadows are cast at noon.</span></span>
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-400 mt-6">
                Please save this key securely. You'll need it for Level 3.
              </p>
            </div>

            <footer className="mt-8 text-sm text-slate-400 flex justify-between">
              <div>Tech Hunt • {new Date().getFullYear()}</div>
              <div className="hidden sm:block">Play fair. Good luck.</div>
            </footer>
          </div>
        </div>
      ) : (
        <Modal
          open={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title="Level 2 Key Generated!"
          subtitle="Your key has been successfully generated. Keep it safe for the next level."
          keyValue={level2Key}
          level={2}
        />
      )}
    </div>
  );
}