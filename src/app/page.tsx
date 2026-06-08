'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Nav from './components/Nav';

type ScheduleItem = {
  time: string;
  title: string;
  description: string;
  detail: string;
};

const scheduleItems: ScheduleItem[] = [
  {
    time: '09:00',
    title: 'Ontvangst met koffie',
    description: 'Welkom bij de Citadel van Diest',
    detail: 'We heten iedereen hartelijk welkom aan de Citadel. Er is koffie, thee en een lichte snack voorzien. Een ideaal moment om elkaar te leren kennen voor we vertrekken.',
  },
  {
    time: '09:30',
    title: 'Start wandeling',
    description: 'Vertrek voor een inspirerende wandeling',
    detail: 'We starten de wandeling vanuit de Citadel. De route leidt ons door het pittoreske landschap rondom Diest, langs historische wallen en groene valleien.',
  },
  {
    time: '12:00',
    title: 'Aankomst citadel',
    description: 'Gezamenlijke lunch onderweg',
    detail: 'Na de ochtendwandeling komen we samen voor een gezellige lunch. Er is een gevarieerd aanbod voorzien voor iedereen.',
  },
  {
    time: '14:00',
    title: 'Spreker 1',
    description: 'Inspirerende lezing',
    detail: 'Meer informatie over deze spreker volgt binnenkort.',
  },
  {
    time: '15:30',
    title: 'Muziek',
    description: 'Even op adem komen',
    detail: 'Muzikale noot als intermezzo. Laat de klanken op je inwerken terwijl je geniet van de omgeving.',
  },
  {
    time: '17:00',
    title: 'Spreker 2',
    description: 'Inspirerende lezing',
    detail: 'Meer informatie over deze spreker volgt binnenkort.',
  },
  {
    time: '18:00',
    title: 'Muziek & afsluiting',
    description: 'Afsluiting van de dag',
    detail: 'We sluiten de dag af met muziek en een informeel samenzijn. Een mooi moment om de dag te laten bezinken.',
  },
];

const EVENT_DATE = new Date('2026-08-29T09:00:00');

function getTimeLeft() {
  const diff = EVENT_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  };
}

function Countdown({ onSecondsClick }: { onSecondsClick: () => void }) {
  const [time, setTime] = useState<ReturnType<typeof getTimeLeft> | null>(null);

  useEffect(() => {
    setTime(getTimeLeft());
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { label: 'Dagen',  value: time?.days,    clickable: false },
    { label: 'Uren',   value: time?.hours,   clickable: false },
    { label: 'Min',    value: time?.minutes, clickable: false },
    { label: 'Sec',    value: time?.seconds, clickable: true  },
  ];

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {units.map(({ label, value, clickable }, i) => (
        <div key={label} className="flex items-center gap-2 sm:gap-3">
          <div
            onClick={clickable ? onSecondsClick : undefined}
            className={`flex min-w-[64px] flex-col items-center rounded-2xl border border-[#0000CD]/15 bg-white/55 px-3 py-2.5 backdrop-blur-sm sm:min-w-[72px] transition-colors ${
              clickable ? 'cursor-pointer hover:bg-white/80 hover:border-[#0000CD]/30' : ''
            }`}
          >
            <span className="text-2xl font-bold tabular-nums text-[#0000CD] sm:text-3xl">
              {value == null ? '--' : String(value).padStart(2, '0')}
            </span>
            <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-[#0000CD]/50">
              {label}
            </span>
          </div>
          {i < 3 && (
            <span className="mb-3 text-xl font-bold text-[#0000CD]/30">:</span>
          )}
        </div>
      ))}
    </div>
  );
}

function Stork() {
  return (
    <svg
      viewBox="0 0 200 80"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      aria-hidden="true"
    >
      {/* Upper wing */}
      <g style={{ transformBox: 'fill-box', transformOrigin: 'right center', animation: 'wingUp 1.1s ease-in-out infinite' }}>
        <path d="M100,38 C84,22 54,11 12,16 C44,26 78,34 96,40 Z" fill="white" />
      </g>

      {/* Lower wing */}
      <g style={{ transformBox: 'fill-box', transformOrigin: 'right center', animation: 'wingDown 1.1s ease-in-out infinite' }}>
        <path d="M100,46 C84,62 54,72 12,67 C44,59 78,51 96,45 Z" fill="white" />
      </g>

      {/* Body */}
      <path d="M62,38 C80,31 130,31 152,40 C138,52 82,53 62,44 Z" fill="white" />

      {/* Neck */}
      <path d="M152,40 C165,34 173,26 171,16" stroke="white" strokeWidth="7" strokeLinecap="round" fill="none" />

      {/* Head */}
      <circle cx="170" cy="14" r="6.5" fill="white" />

      {/* Beak */}
      <path d="M176,13 L200,11" stroke="white" strokeWidth="3.5" strokeLinecap="round" />

      {/* Legs trailing behind */}
      <path d="M85,49 L70,72" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M94,49 L83,72" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function TimelineEntry({
  item,
  isLast,
}: {
  item: ScheduleItem;
  index: number;
  isLast: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex gap-5 md:gap-8">
      {!isLast && (
        <div className="absolute left-[calc(4rem+10px)] top-8 bottom-0 w-px bg-[#0000CD]/15 md:left-[calc(5rem+10px)]" />
      )}

      <div className="w-16 md:w-20 flex-shrink-0 pt-1 text-right">
        <span className="text-sm font-bold tabular-nums text-[#0000CD]">{item.time}</span>
      </div>

      <div className="relative flex-shrink-0 flex flex-col items-center">
        <div
          className={`mt-1.5 h-5 w-5 rounded-full border-2 border-[#0000CD] transition-colors duration-200 ${
            open ? 'bg-[#0000CD]' : 'bg-white'
          }`}
        />
      </div>

      <div className="flex-1 pb-8">
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="group flex w-full cursor-pointer items-start justify-between gap-3 text-left"
        >
          <div>
            <h3 className="text-base font-semibold text-[#0000CD] md:text-lg leading-snug">
              {item.title}
            </h3>
            <p className="mt-0.5 text-sm text-[#0000CD]/55 leading-relaxed">
              {item.description}
            </p>
          </div>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`mt-1 flex-shrink-0 text-[#0000CD]/40 transition-transform duration-200 group-hover:text-[#0000CD]/70 ${
              open ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            open ? 'max-h-48 opacity-100 mt-3' : 'max-h-0 opacity-0'
          }`}
        >
          <p className="rounded-xl border border-[#0000CD]/12 bg-[#0000CD]/[0.04] px-4 py-3 text-sm leading-relaxed text-[#0000CD]/70">
            {item.detail}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [storkActive, setStorkActive] = useState(false);

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ── */}
      {/*
        Drop a landscape photo of the venue at /public/hero.jpg to activate the
        background image — the gradient overlay is always on top so text stays readable.
      */}
      <div
        className="relative flex min-h-screen flex-col overflow-hidden"
        style={{
          backgroundImage: [
            'linear-gradient(135deg, rgba(245,205,182,0.93) 0%, rgba(253,232,220,0.88) 50%, rgba(232,196,176,0.94) 100%)',
            "url('/hero.jpg')",
          ].join(', '),
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dot texture */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(rgba(0,0,205,0.065) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <Nav />

        {/* Hero content */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-24 pt-8 text-center">
          {/* Date + location badge */}
          <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-[#0000CD]/20 bg-white/50 px-5 py-2.5 text-sm font-semibold text-[#0000CD] backdrop-blur-sm">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            29 augustus 2026
            <span className="text-[#0000CD]/30">·</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            Citadel Diest
          </div>

          <h1 className="mb-6 max-w-4xl text-5xl font-bold italic leading-tight tracking-tight text-[#0000CD] sm:text-6xl md:text-7xl lg:text-8xl">
            Wandeling 2026
          </h1>

          <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-[#0000CD]/70 md:text-xl">
            Sluit je aan bij onze wandeling door het prachtige landschap rondom Diest.
            Een dag vol natuur, gezelligheid en inspirerende momenten.
          </p>

          <div className="mb-10">
            <Countdown onSecondsClick={() => setStorkActive(true)} />
          </div>

          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Link href="/inschrijven">
              <button className="inline-flex cursor-pointer items-center justify-center rounded-full bg-[#0000CD] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[#0000CD]/20 transition-all hover:scale-[1.03] hover:bg-[#0000B0] hover:shadow-xl active:scale-95">
                Schrijf je in
              </button>
            </Link>
          </div>

          {/* Scroll hint */}
          <a href="#programma" className="absolute bottom-24 left-1/2 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-1.5 text-[#0000CD]/40 transition-colors hover:text-[#0000CD]/70">
            <span className="text-xs font-semibold uppercase tracking-[0.2em]">Programma</span>
            <div className="animate-bounce">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </a>
        </div>

        {/* Stork — triggered by clicking the seconds tile */}
        {storkActive && (
          <div
            className="pointer-events-none absolute top-[50%]"
            style={{ animation: 'storkFlyAcross 8s cubic-bezier(0.37, 0, 0.63, 1) forwards' }}
            onAnimationEnd={() => setStorkActive(false)}
          >
            <div
              className="w-16 md:w-24"
              style={{ animation: 'storkBob 1.1s ease-in-out infinite' }}
            >
              <Stork />
            </div>
          </div>
        )}

        {/* Two-layer SVG wave → white */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 leading-[0]">
          <svg
            viewBox="0 0 1440 90"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="block w-full"
            style={{ height: '90px' }}
          >
            <path
              d="M0,70 C320,20 760,90 1100,35 C1240,15 1360,55 1440,48 L1440,90 L0,90 Z"
              fill="rgba(245,205,182,0.35)"
            />
            <path
              d="M0,58 C300,100 740,18 1080,58 C1230,78 1370,32 1440,52 L1440,90 L0,90 Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      {/* ── Schedule ── */}
      <section id="programma" className="bg-white px-4 py-16 md:py-20 scroll-mt-0">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-12 text-center text-3xl font-bold italic text-[#0000CD] md:text-4xl">
            Programma van de dag
          </h2>
          <div className="rounded-2xl border border-[#0000CD]/10 bg-[#FAFAF8] px-6 py-8 shadow-sm md:px-10">
            {scheduleItems.map((item, index) => (
              <TimelineEntry
                key={index}
                item={item}
                index={index}
                isLast={index === scheduleItems.length - 1}
              />
            ))}
          </div>
        </div>
      </section>


      {/* ── Footer ── */}
      <footer className="bg-white px-4 py-8 text-center">
        <p className="italic text-[#0000CD]/40">
          In de schaduw van de ooievaar • Wandeling 2026
        </p>
      </footer>
    </div>
  );
}
