'use client';

import Image from 'next/image';
import Nav from '../components/Nav';
import InstagramIcon from '../components/InstagramIcon';

export default function GoedDoel() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5CDB6] via-[#FDE8DC] to-[#E8C4B0]">
      <Nav />

      <main className="mx-auto max-w-3xl px-4 pb-20 pt-4 sm:pt-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="mb-4 text-4xl font-bold italic tracking-tight text-[#0000CD] sm:text-5xl md:text-6xl">
            Goed doel
          </h1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-[#0000CD]/70 sm:text-lg">
            De volledige opbrengst van Wandeling 2026 gaat naar Movember.
          </p>
        </div>

        {/* Wat is Movember */}
        <div className="mb-6 rounded-2xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-8">
          <h2 className="mb-3 text-xl font-bold text-[#0000CD] sm:text-2xl">
            Wat is Movember?
          </h2>
          <p className="mb-3 leading-relaxed text-[#0000CD]/70">
            Movember is een wereldwijde beweging rond mannengezondheid. Elke november laten
            deelnemers hun snor staan om het gesprek op gang te brengen over onderwerpen die
            vaak onderbelicht blijven: prostaatkanker, testiskanker, mentale gezondheid en
            zelfdodingspreventie.
          </p>
          <p className="mb-5 leading-relaxed text-[#0000CD]/70">
            Met deze wandeling willen we die beweging steunen en zelf een steentje bijdragen
            aan onderzoek en ondersteuning voor mannen die het nodig hebben.
          </p>
          <a
            href="https://www.instagram.com/movember/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#0000CD] px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#0000B8] hover:shadow-lg active:scale-95 subpixel-antialiased"
          >
            <InstagramIcon className="h-4 w-4" />
            Movember
          </a>
        </div>

        {/* Sponsors */}
        <div className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-8">
          <h2 className="mb-3 text-xl font-bold text-[#0000CD] sm:text-2xl">
            Onze sponsors
          </h2>
          <div className="mb-5 flex justify-center">
            <div className="inline-flex rounded-xl bg-white p-4">
              <Image
                src="/logo_bamps_laevers.jpeg"
                alt="Bamps-Laevers Verzekeringen"
                width={646}
                height={475}
                className="h-auto w-40 sm:w-48"
              />
            </div>
          </div>
          <p className="mb-5 leading-relaxed text-[#0000CD]/70">
            Met dank aan Bamps-Laevers Verzekeringen voor hun steun aan dit initiatief. Wil
            je zelf ook sponsoren en je logo hier mee in de kijker zetten? Download ons
            sponsorformulier en bezorg het ingevuld terug.
          </p>
          <a
            href="/Sponsorformulier.docx"
            download
            className="inline-flex items-center gap-2 rounded-full bg-[#0000CD] px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#0000B8] hover:shadow-lg active:scale-95 subpixel-antialiased"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3v13m0 0l-4.5-4.5M12 16l4.5-4.5" />
              <path d="M4 19h16" />
            </svg>
            Download sponsorformulier
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-4 py-8 text-center">
        <p className="italic text-[#0000CD]/40">
          In de schaduw van de ooievaar • Wandeling 2026
        </p>
      </footer>
    </div>
  );
}
