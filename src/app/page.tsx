'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const scheduleItems = [
    { time: '09:00', title: 'Ontvangst met koffie', description: 'Welkom bij de Citadel van Diest' },
    { time: '09:30', title: 'Start wandeling', description: 'Vertrek voor een inspirerende wandeling' },
    { time: '12:00', title: 'Aankomst citadel', description: 'Gezamenlijke lunch onderweg' },
    { time: '14:00', title: 'Spreker 1', description: 'Verder langs mooie plekken' },
    { time: '15:30', title: 'Muziek', description: 'Even op adem komen' },
    { time: '17:00', title: 'Afsluiting', description: 'Terug bij de Citadel met receptie' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5CDB6] via-[#FDE8DC] to-[#E8C4B0]">
      {/* Navigation/Header */}
      <header className="px-4 py-6">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-3">
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
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-12 md:py-20">
        <div className="mx-auto max-w-6xl text-center">
          <div className="mb-8 inline-block rounded-full bg-[#0000CD]/10 px-6 py-3 text-sm font-semibold text-[#0000CD] border-2 border-[#0000CD]/20">
            29 augustus 2026 • Citadel Diest
          </div>
          <h1 className="mb-8 text-5xl font-bold tracking-tight text-[#0000CD] sm:text-6xl md:text-7xl lg:text-8xl italic leading-tight">
            In de schaduw
            <span className="block mt-2">
              van de ooievaar
            </span>
          </h1>
          <div className="mb-8 text-3xl md:text-4xl font-semibold text-[#0000CD]/80">
            Wandeling 2026
          </div>
          <p className="mx-auto mb-12 max-w-2xl text-lg text-[#0000CD]/70 md:text-xl leading-relaxed">
            Sluit je aan bij onze wandeling door het prachtige landschap rondom Diest. 
            Een dag vol natuur, gezelligheid en inspirerende momenten.
          </p>
          <Link href="/inschrijven">
            <button className="inline-flex items-center justify-center rounded-full bg-[#0000CD] px-10 py-5 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-[#0000B8] hover:shadow-xl active:scale-95 md:px-12 md:py-6">
              Schrijf je in
            </button>
          </Link>
        </div>
      </section>

      {/* Schedule Section */}
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-[#0000CD] md:text-4xl italic">
            Programma van de dag
          </h2>
          <div className="space-y-4">
            {scheduleItems.map((item, index) => (
              <div
                key={index}
                className="group rounded-2xl border-2 border-[#0000CD]/20 bg-white/80 backdrop-blur-sm p-6 shadow-sm transition-all hover:scale-[1.02] hover:shadow-lg hover:border-[#0000CD]/40 md:p-8"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
                  <div className="flex-shrink-0">
                    <div className="inline-block rounded-xl bg-[#0000CD] px-4 py-2 font-bold text-white shadow-sm md:px-6 md:py-3 min-w-[80px] text-center">
                      {item.time}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-xl font-semibold text-[#0000CD] md:text-2xl">
                      {item.title}
                    </h3>
                    <p className="text-[#0000CD]/70">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl rounded-3xl bg-[#0000CD] px-8 py-12 text-center shadow-2xl md:px-16 md:py-16 border-4 border-white">
          <div className="flex justify-center mb-6">
            <Image 
              src="/logo.svg" 
              alt="Ooievaar" 
              width={80} 
              height={80}
              className="w-20 h-20 md:w-24 md:h-24 brightness-0 invert"
            />
          </div>
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl italic">
            Mis het niet!
          </h2>
          <p className="mb-8 text-lg text-white/90 md:text-xl">
            Schrijf je nu in en ontvang meer informatie over de wandeling, routekaarten en praktische tips.
          </p>
          <Link href="/inschrijven">
            <button className="inline-flex items-center justify-center rounded-full bg-white px-10 py-5 text-lg font-semibold text-[#0000CD] shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95 md:px-12 md:py-6">
              Schrijf je nu in
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 text-center">
        <p className="text-[#0000CD]/60 italic">
          In de schaduw van de ooievaar • Wandeling 2026
        </p>
      </footer>
    </div>
  );
}
