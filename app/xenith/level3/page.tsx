// app/xenith/level3/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import OTPModal from "../../../components/xenith/OTPModal";

export default function Level3() {
  const [level2Key, setLevel2Key] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [verifyEmail, setVerifyEmail] = useState("");
  const [sendingOTP, setSendingOTP] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [verifyingOTP, setVerifyingOTP] = useState(false);
  const [copied, setCopied] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [finalKey, setFinalKey] = useState("");
  const router = useRouter();

  // Check if user has completed level 2
  useEffect(() => {
    const savedKey = localStorage.getItem("xenith_level2_key");
    if (!savedKey) {
      router.push("/xenith/level2");
    }
  }, [router]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If OTP is entered, verify it instead of sending new OTP
    if (otpSent && otp.every(digit => digit) && otp.length === 6) {
      await handleOTPVerify(otp);
      return;
    }

    // If resending OTP, reset state
    if (otpSent && otp.every(digit => !digit)) {
      setOtpSent(false);
      setOtp(['', '', '', '', '', '']);
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/xenith/level3/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level2Key }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Verification failed");
      }

      setEmail(data.email);
      setOtpModalOpen(true);
      setOtpSent(true);
      setLoading(false);
    } catch (err) {
      console.error("Error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Verification failed";
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.every(digit => digit) || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }
    await handleOTPVerify(otp);
  };

  const handleSendOTP = async () => {
  if (!level2Key) {
    setError('Please enter your Level 2 key first');
    return;
  }

  setSendingOTP(true);
  setError("");

  try {
    // Verify Level 2 key is valid for this email
    const verifyResponse = await fetch('/api/xenith/level3/verify-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        level2Key,
        email: verifyEmail 
      })
    });

    if (!verifyResponse.ok) {
      const errorData = await verifyResponse.json();
      throw new Error(errorData.error || 'Invalid Level 2 key for this email');
    }

    // If key is valid, send OTP
    const otpResponse = await fetch('/api/xenith/level3/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: verifyEmail })
    });

    const data = await otpResponse.json();
    
    if (!otpResponse.ok) {
      throw new Error(data.error || 'Failed to send OTP');
    }

    setOtpSent(true);
  } catch (err) {
    console.error('Error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Failed to send OTP';
    setError(errorMessage);
  } finally {
    setSendingOTP(false);
  }
};

  const handleOTPVerify = async (otpValue: string | string[]) => {
    setVerifyingOTP(true);
    setError("");
    try {
      // Handle both string and array OTP values
      const otpString = Array.isArray(otpValue) ? otpValue.join('') : otpValue;
      
      const response = await fetch("/api/xenith/level3/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: email || verifyEmail, 
          otp: otpString 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Verification failed");
      }

      // Store final key
      localStorage.setItem("xenith_level3_key", data.level3Key);
      setFinalKey(data.level3Key);
      setCompleted(true);
      setOtpModalOpen(false);
    } catch (err) {
      console.error("Error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Verification failed";
      setError(errorMessage);
    } finally {
      setVerifyingOTP(false);
    }
  };

  if (completed) {
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

        <div className="w-full max-w-2xl mx-auto relative z-10">
          <div className="bg-gradient-to-br from-white/3 to-transparent rounded-3xl p-8 md:p-12 ring-1 ring-white/6 backdrop-blur-sm shadow-2xl text-center">
            <div className="text-amber-400 text-6xl mb-6 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">
              ✓
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]">
              Congratulations!
            </h1>
            <p className="text-lg text-slate-300 mb-8">
              You've successfully completed all levels of Treasure Hunt!
            </p>

            <div className="bg-gradient-to-br from-amber-500/8 to-yellow-400/6 border border-white/6 p-6 rounded-xl mb-8">
              <p className="text-sm text-amber-300 font-semibold uppercase mb-2">
                Your Final Key
              </p>
              <p className="text-2xl font-mono break-all text-white">
                {finalKey}
              </p>
              <button
                onClick={() => copyToClipboard(finalKey)}
                className="p-2 text-amber-300 hover:text-amber-200 transition-colors"
                title={copied ? "Copied!" : "Copy to clipboard"}
              >
                {copied ? (
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
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : (
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
                  >
                    <rect
                      x="9"
                      y="9"
                      width="13"
                      height="13"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                )}
              </button>
            </div>

            <p className="text-sm text-slate-400">
              Please save this key securely. You'll need it to claim your
              rewards.
            </p>
          </div>

          <footer className="mt-8 text-sm text-slate-400 flex justify-between">
            <div>Tech Hunt • {new Date().getFullYear()}</div>
            <div className="hidden sm:block">Play fair. Good luck.</div>
          </footer>
        </div>
      </div>
    );
  }

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
              />
              <div className="h-8 w-px bg-white/20"></div>
              <img
                src="/xenith/logo.png"
                className="w-12 h-12 object-contain"
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
            <div className="flex flex-col gap-6 justify-center">
              <div className="rounded-xl p-6 bg-gradient-to-br from-amber-500/8 to-yellow-400/6 border border-white/6">
                <div className="text-sm text-amber-300 font-semibold uppercase">
                  Level 3 • Final Route
                </div>
                <h2 className="mt-3 text-2xl md:text-3xl font-bold text-white">
                  Complete the hunt
                </h2>
                <p className="mt-2 text-sm text-slate-200">
                  Enter your Level 2 key to claim your final key.
                </p>

                <div className="mt-6 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-white/6 flex items-center justify-center text-amber-300 font-bold text-lg">
                    3
                  </div>
                  <div className="text-sm text-slate-300">
                    This is your final key — save it securely.
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
                    Level 2 Key
                  </label>
                  <input
                    type="text"
                    id="level2Key"
                    value={level2Key}
                    onChange={(e) => setLevel2Key(e.target.value)}
                    className="w-full rounded-xl px-4 py-3 bg-white/5 border border-white/6 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-400"
                    required
                    placeholder="XEN-2-XXXXXX"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Enter the key you received from Level 2.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-200 mb-2">
                      {otpSent ? 'Enter OTP' : 'IITP Email (Verify Connection)'}
                    </label>
                    
                    {otpSent ? (
                      <div className="space-y-3">
                        <div className="flex justify-center gap-2 sm:gap-3">
                          {[...Array(6)].map((_, i) => (
                            <input
                              key={i}
                              type="text"
                              value={otp[i] || ''}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                if (value && i < 5) {
                                  document.getElementById(`otp-input-${i + 1}`)?.focus();
                                }
                                const newOtp = [...otp];
                                newOtp[i] = value.slice(-1);
                                setOtp(newOtp);
                                setError('');
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Backspace' && !otp[i] && i > 0) {
                                  document.getElementById(`otp-input-${i - 1}`)?.focus();
                                }
                              }}
                              id={`otp-input-${i}`}
                              maxLength={1}
                              inputMode="numeric"
                              className="w-12 h-14 sm:w-14 sm:h-16 text-2xl text-center bg-white/5 border border-white/10 rounded-xl focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all"
                              autoFocus={i === 0}
                            />
                          ))}
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setOtp(['', '', '', '', '', '']);
                              setOtpSent(false);
                            }}
                            className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
                          >
                            Change Email
                          </button>
                          <button
                            type="button"
                            onClick={handleSendOTP}
                            disabled={sendingOTP}
                            className="text-xs text-amber-400 hover:text-amber-300 disabled:opacity-50 transition-colors"
                          >
                            {sendingOTP ? 'Sending...' : 'Resend OTP'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="email"
                          value={verifyEmail}
                          onChange={(e) => setVerifyEmail(e.target.value)}
                          className="flex-1 rounded-xl px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 focus:outline-none transition-all"
                          placeholder="name_roll@iitp.ac.in"
                          pattern="[^@\s]+@iitp\.ac\.in$"
                        />
                        <button
                          type="button"
                          onClick={handleSendOTP}
                          disabled={sendingOTP || !verifyEmail.trim() || !/^[^@\s]+@iitp\.ac\.in$/.test(verifyEmail)}
                          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold shadow hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none whitespace-nowrap"
                        >
                          {sendingOTP ? 'Sending...' : 'Send OTP'}
                        </button>
                      </div>
                    )}
                    
                    {otpSent ? (
                      <p className="text-xs text-slate-400 mt-3 text-center">
                        Enter the 6-digit code sent to <span className="text-amber-300">{email || verifyEmail}</span>
                      </p>
                    ) : (
                      <p className="text-xs text-slate-400 mt-2">
                        We'll send a verification code to your IITP email
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading || (otpSent && otp.some(digit => !digit))}
                    className="w-full rounded-xl px-5 py-4 bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-900 font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying...
                      </span>
                    ) : otpSent ? (
                      'Verify & Continue'
                    ) : (
                      'Continue to Next Level'
                    )}
                  </button>
                </div>

                <div className="text-xs text-slate-400 pt-2">
                  Your final key will be stored securely. Keep it safe to claim
                  your rewards.
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

      <OTPModal
        isOpen={otpModalOpen}
        onClose={() => setOtpModalOpen(false)}
        onVerify={handleOTPVerify}
        email={email}
      />
    </div>
  );
}
