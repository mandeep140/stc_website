"use client";
import React, { useState, useRef, useEffect } from "react";
import { FaKey } from "react-icons/fa";
import {
  GiTreasureMap,
  GiOpenTreasureChest,
} from "react-icons/gi";

export default function Modal({
  open,
  title,
  subtitle,
  keyValue,
  onClose,
  level = 1,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  keyValue?: string | null;
  onClose: () => void;
  level?: number;
}) {
  if (!open) return null;

  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCopy = () => {
    if (keyValue) {
      navigator.clipboard?.writeText(keyValue);
      setCopied(true);

      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }

      copyTimeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
        copyTimeoutRef.current = null;
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-3xl p-6 bg-gradient-to-br from-[#071428]/80 to-[#0b1724]/80 ring-1 ring-white/6 shadow-2xl">
        <button
          onClick={onClose}
          aria-label="close"
          className="absolute right-4 top-4 text-white/70 hover:text-white"
        >
          ✕
        </button>

        <div className="flex flex-col items-center gap-4 text-center">
          <div
            className={`w-28 h-28 flex items-center justify-center rounded-xl shadow-xl ${
              level === 1
                ? "bg-gradient-to-br from-yellow-400 to-amber-500"
                : level === 2
                  ? "bg-gradient-to-br from-amber-500 to-orange-500"
                  : level === 3
                    ? "bg-gradient-to-br from-yellow-500 to-red-500"
                    : "bg-gradient-to-br from-yellow-300 to-amber-400"
            }`}
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-white w-3/4 h-3/4 flex items-center justify-center">
                {level === 1 && <FaKey className="w-full h-full" />}
                {level === 2 && <GiTreasureMap className="w-full h-full" />}
                {level === 3 && <GiOpenTreasureChest className="w-full h-full" />}
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-extrabold text-white">{title}</h3>

          {subtitle && (
            <p className="max-w-md text-sm text-slate-200">{subtitle}</p>
          )}

          {keyValue && (
            <div className="mt-2 w-full">
              <div className="mx-auto max-w-sm bg-white/4 rounded-lg px-4 py-3 font-mono flex items-center justify-between">
                <span className="truncate text-sm text-white/90">
                  {keyValue}
                </span>
                <button
                  onClick={handleCopy}
                  className={`ml-3 text-xs border ${
                    copied ? 'border-green-500/50' : 'border-white/6'
                  } text-white px-2 py-1 rounded-md ${
                    copied ? 'bg-green-500/10' : 'bg-white/6 hover:bg-white/10'
                  } transition-colors min-w-[50px]`}
                  aria-label={copied ? 'Copied!' : 'Copy key'}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          )}

          <p className="mt-4 text-xs text-slate-300 max-w-sm">
            Keep this key safe - you will need it to access the next route.
          </p>

          {level === 1 && (
            <button 
              onClick={() => window.open('/xenith/tech-hunt/2nd-clue.jpg', '_blank')}
              className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-amber-500/20 text-sm"
            >
              Get Clue for Next Level
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
