'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Nav() {
  const [audioOpen, setAudioOpen] = useState(false);

  return (
    <header className="px-4 py-5">
      <div className="mx-auto max-w-6xl flex items-center justify-between">
        {/* Logo + title */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Image
            src="/logo.svg"
            alt="Ooievaar logo"
            width={50}
            height={50}
            className="w-12 h-12 md:w-16 md:h-16"
          />
          <div className="text-[#0000CD] font-bold text-lg md:text-xl italic">
            In de schaduw van de ooievaar
          </div>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          <a
            href="/#programma"
            className="px-4 py-2 rounded-full text-sm font-semibold text-[#0000CD]/75 hover:bg-[#0000CD]/8 hover:text-[#0000CD] transition-colors"
          >
            Programma
          </a>
          <a
            href="/#wandelroute"
            className="px-4 py-2 rounded-full text-sm font-semibold text-[#0000CD]/75 hover:bg-[#0000CD]/8 hover:text-[#0000CD] transition-colors"
          >
            Wandelroute
          </a>

          {/* Audio dropdown */}
          <div className="relative">
            <button
              onClick={() => setAudioOpen((o) => !o)}
              className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold text-[#0000CD]/75 hover:bg-[#0000CD]/8 hover:text-[#0000CD] transition-colors"
            >
              Audio
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-200 ${audioOpen ? 'rotate-180' : ''}`}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {/* Dropdown panel */}
            {audioOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-[#0000CD]/10 bg-white/90 py-2 shadow-[0_8px_32px_rgba(0,0,205,0.12)] backdrop-blur-xl z-50">
                <Link
                  href="/audio"
                  onClick={() => setAudioOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-[#0000CD] hover:bg-[#0000CD]/6 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="opacity-60">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 7.97v8.05A4.5 4.5 0 0016.5 12z" />
                  </svg>
                  Gitaar fragment
                </Link>
              </div>
            )}
          </div>

          <Link href="/inschrijven">
            <button className="ml-2 inline-flex items-center justify-center rounded-full bg-[#0000CD] px-5 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#0000B8] hover:shadow-lg active:scale-95">
              Schrijf je in
            </button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
