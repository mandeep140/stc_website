"use client";
import React, { useState } from "react";
import Modal from "../../../components/xenith/Modal";

function genKey(level: number) {
  return `TH-${level}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export default function Level1() {
  const [name, setName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [teamName, setTeamName] = useState("");

  // Updated submit() with full validation
  function submit(e?: React.FormEvent) {
    e?.preventDefault();

    if (!name.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (teamName.trim().length < 3 || teamName.trim().length > 50) {
      alert("Team Name must be 3–50 characters.");
      return;
    }

    if (!/^[^@\s]+@iitp\.ac\.in$/.test(email)) {
      alert("Please enter a valid IITP email (example@iitp.ac.in).");
      return;
    }

    const k = genKey(1);

    // Save data
    localStorage.setItem("techhunt_key_1", k);
    localStorage.setItem("techhunt_name_1", name.trim());
    localStorage.setItem("techhunt_team_1", teamName.trim());
    localStorage.setItem("techhunt_email_1", email.trim());

    setGeneratedKey(k);
    setModalOpen(true);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{ background: "#0f172a" }}
    >
      {/* Background glow */}
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

            {/* Left section */}
            <div className="flex flex-col gap-6 justify-center">
              <div className="rounded-xl p-6 bg-gradient-to-br from-amber-500/8 to-yellow-400/6 border border-white/6">
                <div className="text-sm text-amber-300 font-semibold uppercase">
                  Level 1 • Route
                </div>
                <h2 className="mt-3 text-2xl md:text-3xl font-bold text-white">
                  Predict the first route
                </h2>
                <p className="mt-2 text-sm text-slate-200">
                  Enter your details to claim your key for Level 2.
                </p>

                <div className="mt-6 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-white/6 flex items-center justify-center text-amber-300 font-bold text-lg">
                    1
                  </div>
                  <div className="text-sm text-slate-300">
                    Keep this key safe — required for Level 2.
                  </div>
                </div>
              </div>

              <div className="h-1 w-full bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80"></div>
            </div>

            {/* Right section (FORM) */}
            <div className="flex flex-col justify-center">
              <form onSubmit={submit} className="space-y-4">

                {/* Full Name + Team Name side by side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div>
                    <label className="block text-sm text-slate-200 mb-1">
                      Full Name
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
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
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="w-full rounded-xl px-4 py-3 bg-white/5 border border-white/6 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-400"
                      placeholder="Enter your team name"
                      minLength={3}
                      maxLength={50}
                      required
                    />
                    <p className="text-xs text-slate-400 mt-1">3–50 characters</p>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm text-slate-200 mb-1">
                    IITP Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl px-4 py-3 bg-white/5 border border-white/6 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-400"
                    placeholder="username@iitp.ac.in"
                    pattern="[^@\s]+@iitp\.ac\.in$"
                    required
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Must be your official IITP email.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 rounded-xl px-5 py-3 bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-900 font-semibold shadow hover:scale-[1.01] transition-transform"
                  >
                    Claim Level 1 Key
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem("techhunt_key_1");
                      localStorage.removeItem("techhunt_name_1");
                      localStorage.removeItem("techhunt_email_1");
                      localStorage.removeItem("techhunt_team_1");
                      setName("");
                      setEmail("");
                      setTeamName("");
                      setGeneratedKey(null);
                      alert("Level 1 data cleared.");
                    }}
                    className="px-4 py-3 rounded-xl border border-white/6 text-white"
                  >
                    Reset
                  </button>
                </div>

                <div className="text-xs text-slate-400 pt-2">
                  Your unique key will be stored securely. Keep it safe for Level 2.
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

      {/* Modal */}
      <Modal
        open={modalOpen}
        title={generatedKey ? "Congratulations - Level 1 unlocked!" : "Input Required"}
        subtitle={
          generatedKey
            ? "You cracked Level 1! This is your unique key — keep it safe."
            : "Please fill out all required fields."
        }
        keyValue={generatedKey}
        onClose={() => setModalOpen(false)}
        level={1}
      />
    </div>
  );
}
