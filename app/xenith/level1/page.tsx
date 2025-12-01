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

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!name.trim()) {
      setGeneratedKey(null);
      setModalOpen(true);
      return;
    }
    const k = genKey(1);
    localStorage.setItem("techhunt_key_1", k);
    localStorage.setItem("techhunt_name_1", name.trim());
    setGeneratedKey(k);
    setModalOpen(true);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{
        background: "#0f172a",
      }}
    >
      {/* Yellow glow effect */}
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
                alt="STC Logo"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="h-8 w-px bg-white/20"></div>
              <img
                src="/xenith/logo.png"
                alt="XENITH Logo"
                className="w-12 h-12 object-contain"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]">
              Treasure Hunt
            </h1>
            <p className="mt-2 text-sm text-slate-300 max-w-2xl">
              Decipher the clues and navigate through the challenges to advance to the next level.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="text-sm text-slate-300">Progress</div>
            <div className="w-36 h-3 bg-white/6 rounded-full overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-yellow-300/20 rounded-full animate-pulse"></div>
              <div
                className="h-3 bg-gradient-to-r from-amber-400 to-yellow-300 relative z-10 shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                style={{ width: "33.33%" }}
              />
            </div>
          </div>
        </header>

        <main className="bg-gradient-to-br from-white/3 to-transparent rounded-3xl p-8 md:p-12 ring-1 ring-white/6 backdrop-blur-sm shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-6 justify-center">
              <div className="rounded-xl p-6 bg-gradient-to-br from-amber-500/8 to-yellow-400/6 border border-white/6">
                <div className="text-sm text-amber-300 uppercase font-semibold">
                  Level 1 • Route
                </div>
                <h2 className="mt-3 text-2xl md:text-3xl font-bold text-white">
                  Predict the first route
                </h2>
                <p className="mt-2 text-sm text-slate-200">
                  Use the clue you found to land on this page - then enter your
                  name to claim the key.
                </p>

                <div className="mt-6 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-white/6 flex items-center justify-center text-amber-300 font-bold text-lg">
                    1
                  </div>
                  <div className="text-sm text-slate-300">
                    Keep the key secure. It’s required for Level 2 access.
                  </div>
                </div>
              </div>

              <div className="h-1 w-full rounded-full bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80" />
            </div>

            <div className="flex flex-col justify-center">
              <form onSubmit={submit} className="space-y-4">
                <label className="block text-sm text-slate-200">
                  Full name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 bg-white/5 border border-white/6 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="Enter your full name"
                />

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 rounded-xl px-5 py-3 bg-gradient-to-r from-amber-400 to-yellow-300 font-semibold text-slate-900 shadow hover:scale-[1.01] transition-transform"
                  >
                    Claim Level 1 Key
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem("techhunt_key_1");
                      localStorage.removeItem("techhunt_name_1");
                      setGeneratedKey(null);
                      setName("");
                      alert("Cleared Level 1 data.");
                    }}
                    className="px-4 py-3 rounded-xl border border-white/6 text-white"
                  >
                    Reset
                  </button>
                </div>

                <div className="pt-2 text-xs text-slate-400">
                  This page issues a unique key on successful submission. Keys
                  are stored in your browser for demo purposes.
                </div>
              </form>

              <div className="mt-6 text-sm text-slate-300">
                After claiming, find Level 2 Route and enter the key from Level
                1.
              </div>
            </div>
          </div>
        </main>

        <footer className="mt-8 text-sm text-slate-400 flex items-center justify-between">
          <div>Tech Hunt • {new Date().getFullYear()}</div>
          <div className="hidden sm:block">Play fair. Good luck.</div>
        </footer>
      </div>

      <Modal
        open={modalOpen}
        title={
          generatedKey ? "Congratulations - Level 1 unlocked!" : "Name required"
        }
        subtitle={
          generatedKey
            ? "You cracked Level 1. Below is your unique key. Guard it - you will need it to access the next route."
            : "Please enter your name before submitting."
        }
        keyValue={generatedKey}
        onClose={() => {
          setModalOpen(false);
        }}
        level={1}
      />
    </div>
  );
}
