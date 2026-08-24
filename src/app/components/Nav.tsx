'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import InstagramIcon from './InstagramIcon';

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="relative z-50 px-4 py-5">
      <div className="mx-auto max-w-6xl flex items-center justify-between">
        {/* Logo + title */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image
              src="/logo_aaron.png"
              alt="Logo aaron"
              width={50}
              height={50}
              className="w-12 h-12 md:w-16 md:h-16 object-contain"
            />
            <div className="text-[#0000CD] font-bold text-base md:text-xl italic">
              In de schaduw van de ooievaar
            </div>
          </Link>

          {/* Social link — subtle, next to the name */}
          <div className="hidden sm:flex items-center pl-1">
            <a
              href="https://www.instagram.com/indeschaduwvandeooievaar/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="In de schaduw van de ooievaar op Instagram"
              className="text-[#0000CD]/30 transition-colors hover:text-[#0000CD]/60"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          <a
            href="/#programma"
            className="px-4 py-2 rounded-full text-sm font-semibold text-[#0000CD]/75 hover:bg-[#0000CD]/8 hover:text-[#0000CD] transition-colors"
          >
            Programma
          </a>
          <a
            href="/wandelroute"
            className="px-4 py-2 rounded-full text-sm font-semibold text-[#0000CD]/75 hover:bg-[#0000CD]/8 hover:text-[#0000CD] transition-colors"
          >
            Wandelroute
          </a>
          <a
            href="/goed-doel"
            className="px-4 py-2 rounded-full text-sm font-semibold text-[#0000CD]/75 hover:bg-[#0000CD]/8 hover:text-[#0000CD] transition-colors"
          >
            Goed doel
          </a>
          <a
            href="/muziek-en-fotos"
            className="px-4 py-2 rounded-full text-sm font-semibold text-[#0000CD]/75 hover:bg-[#0000CD]/8 hover:text-[#0000CD] transition-colors"
          >
            Muziek &amp; foto&apos;s
          </a>

          <a href="https://idsvdo.stager.co/shop/idsvdo" target="_blank" rel="noopener noreferrer">
            <button className="subpixel-antialiased ml-2 inline-flex items-center justify-center rounded-full bg-[#0000CD] px-5 py-2 text-sm font-bold text-white shadow-md transition-all hover:bg-[#0000B8] hover:shadow-lg active:scale-95 cursor-pointer">
              Schrijf je in
            </button>
          </a>
        </nav>

        {/* Hamburger button — mobile only */}
        <button
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Menu openen"
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-full border border-[#0000CD]/15 bg-white/60 backdrop-blur-sm transition hover:bg-white/80"
        >
          <span
            className={`block h-0.5 w-5 bg-[#0000CD] rounded-full transition-all duration-300 ${mobileOpen ? 'translate-y-[5px] rotate-45' : ''}`}
          />
          <span
            className={`block h-0.5 w-5 bg-[#0000CD] rounded-full transition-all duration-300 mt-[4px] ${mobileOpen ? 'opacity-0' : ''}`}
          />
          <span
            className={`block h-0.5 w-5 bg-[#0000CD] rounded-full transition-all duration-300 mt-[4px] ${mobileOpen ? '-translate-y-[9px] -rotate-45' : ''}`}
          />
        </button>
      </div>

      {/* Mobile menu panel */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <nav className="mx-auto max-w-6xl mt-3 rounded-2xl border border-[#0000CD]/10 bg-white/90 py-3 shadow-[0_8px_32px_rgba(0,0,205,0.10)] backdrop-blur-xl">
          <a
            href="/#programma"
            onClick={closeMobile}
            className="flex items-center px-5 py-3 text-sm font-semibold text-[#0000CD]/80 hover:bg-[#0000CD]/5 hover:text-[#0000CD] transition-colors"
          >
            Programma
          </a>
          <a
            href="/wandelroute"
            onClick={closeMobile}
            className="flex items-center px-5 py-3 text-sm font-semibold text-[#0000CD]/80 hover:bg-[#0000CD]/5 hover:text-[#0000CD] transition-colors"
          >
            Wandelroute
          </a>
          <a
            href="/goed-doel"
            onClick={closeMobile}
            className="flex items-center px-5 py-3 text-sm font-semibold text-[#0000CD]/80 hover:bg-[#0000CD]/5 hover:text-[#0000CD] transition-colors"
          >
            Goed doel
          </a>
          <a
            href="/muziek-en-fotos"
            onClick={closeMobile}
            className="flex items-center px-5 py-3 text-sm font-semibold text-[#0000CD]/80 hover:bg-[#0000CD]/5 hover:text-[#0000CD] transition-colors"
          >
            Muziek &amp; foto&apos;s
          </a>

          <div className="mt-2 border-t border-[#0000CD]/8 px-5 pt-3 pb-1">
            <a href="https://idsvdo.stager.co/shop/idsvdo" target="_blank" rel="noopener noreferrer" onClick={closeMobile}>
              <button className="subpixel-antialiased w-full inline-flex items-center justify-center rounded-full bg-[#0000CD] px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#0000B8] active:scale-95 cursor-pointer">
                Schrijf je in
              </button>
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
