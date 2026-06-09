'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Nav from '../components/Nav';
import { supabase } from '../../lib/supabase';

const MAX_REGISTRATIONS = 500;

const PRICE_PER_PERSON = 30;
const PRICE_PER_HAT = 15;

function Stepper({ value, min = 0, onChange }: { value: number; min?: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#0000CD]/20 text-lg font-medium text-[#0000CD] transition-colors hover:bg-[#0000CD]/8 disabled:cursor-not-allowed disabled:opacity-30"
      >
        −
      </button>
      <span className="w-10 text-center text-xl font-bold tabular-nums text-[#0000CD]">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#0000CD]/20 text-lg font-medium text-[#0000CD] transition-colors hover:bg-[#0000CD]/8"
      >
        +
      </button>
    </div>
  );
}

function SectionHeader({ number, title }: { number: number; title: string }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#0000CD] text-[10px] font-bold text-white">
        {number}
      </div>
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0000CD]/45">{title}</span>
    </div>
  );
}

const inputClass =
  'w-full rounded-xl border border-[#0000CD]/20 bg-white px-4 py-3 text-sm text-[#0000CD] placeholder:text-[#0000CD]/30 transition-colors focus:border-[#0000CD]/50 focus:outline-none focus:ring-2 focus:ring-[#0000CD]/10';

export default function Inschrijven() {
  const [formData, setFormData] = useState({
    voornaam: '',
    achternaam: '',
    email: '',
    telefoon: '',
    aantal: 1,
    petjes: 0,
    opmerkingen: '',
    avondeten: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registrationCount, setRegistrationCount] = useState<number | null>(null);
  const [countLoading, setCountLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('inschrijvingen')
      .select('*', { count: 'exact', head: true })
      .then(({ count }) => {
        setRegistrationCount(count ?? 0);
        setCountLoading(false);
      });
  }, []);

  const isFull = registrationCount !== null && registrationCount >= MAX_REGISTRATIONS;
  const spotsLeft = registrationCount !== null ? Math.max(0, MAX_REGISTRATIONS - registrationCount) : null;

  const walkPrice = formData.aantal * PRICE_PER_PERSON;
  const hatPrice = formData.petjes * PRICE_PER_HAT;
  const totalPrice = walkPrice + hatPrice;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const value = target instanceof HTMLInputElement && target.type === 'checkbox'
      ? target.checked
      : target.value;
    setFormData(f => ({ ...f, [target.name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Re-check capacity before inserting (race condition guard)
    const { count } = await supabase
      .from('inschrijvingen')
      .select('*', { count: 'exact', head: true });
    if ((count ?? 0) >= MAX_REGISTRATIONS) {
      setRegistrationCount(count ?? MAX_REGISTRATIONS);
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase
      .from('inschrijvingen')
      .insert({
        voornaam: formData.voornaam,
        achternaam: formData.achternaam,
        email: formData.email,
        telefoon: formData.telefoon,
        aantal: formData.aantal,
        petjes: formData.petjes,
        opmerkingen: formData.opmerkingen || null,
        avondeten: formData.avondeten,
        totaalprijs: totalPrice,
      });

    setLoading(false);

    if (insertError) {
      setError('Er ging iets mis bij het opslaan. Probeer het opnieuw.');
      console.error('Supabase insert error:', insertError);
      return;
    }

    try {
      await fetch('/api/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voornaam: formData.voornaam,
          achternaam: formData.achternaam,
          email: formData.email,
          telefoon: formData.telefoon,
          aantal: formData.aantal,
          petjes: formData.petjes,
          opmerkingen: formData.opmerkingen || null,
          avondeten: formData.avondeten,
          totaalprijs: totalPrice,
          walkPrice,
          hatPrice,
        }),
      });
    } catch (emailErr) {
      console.error('Email send error:', emailErr);
    }

    setSubmitted(true);
  };

  // ── Success screen ──────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#F5CDB6] via-[#FDE8DC] to-[#E8C4B0] px-4 py-12">
        <div className="w-full max-w-md text-center">
          {/* Animated checkmark */}
          <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full bg-[#0000CD]/15" style={{ animationDuration: '2s' }} />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#0000CD] shadow-lg shadow-[#0000CD]/30">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
          </div>

          <h1 className="mb-3 text-3xl font-bold italic text-[#0000CD] md:text-4xl">Bedankt!</h1>
          <p className="mb-8 leading-relaxed text-[#0000CD]/65">
            Je inschrijving is goed ontvangen. Je krijgt binnenkort een bevestiging per e-mail met meer informatie.
          </p>

          {/* Registration summary */}
          <div className="mb-6 rounded-2xl border border-[#0000CD]/10 bg-white/80 p-6 text-left shadow-sm backdrop-blur-sm">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#0000CD]/40">Jouw inschrijving</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#0000CD]/60">Naam</span>
                <span className="font-medium text-[#0000CD]">{formData.voornaam} {formData.achternaam}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#0000CD]/60">Personen</span>
                <span className="font-medium text-[#0000CD]">{formData.aantal}</span>
              </div>
              {formData.petjes > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#0000CD]/60">Petjes</span>
                  <span className="font-medium text-[#0000CD]">{formData.petjes}</span>
                </div>
              )}
              {formData.avondeten && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#0000CD]/60">Avondeten</span>
                  <span className="font-medium text-[#0000CD]">Ja</span>
                </div>
              )}
              <div className="flex justify-between border-t border-[#0000CD]/10 pt-2 text-sm">
                <span className="font-semibold text-[#0000CD]">Totaal</span>
                <span className="font-bold text-[#0000CD]">€{totalPrice}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/">
              <button className="inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-[#0000CD] px-7 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#0000B0] hover:scale-[1.02] active:scale-95 sm:w-auto">
                Terug naar home
              </button>
            </Link>
            <Link href="/wandelroute">
              <button className="inline-flex w-full cursor-pointer items-center justify-center rounded-full border border-[#0000CD]/20 bg-white/60 px-7 py-3.5 text-sm font-semibold text-[#0000CD] backdrop-blur-sm transition-all hover:bg-white/80 active:scale-95 sm:w-auto">
                Bekijk de wandelroute
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Loading count ───────────────────────────────────────────────────
  if (countLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#F5CDB6] via-[#FDE8DC] to-[#E8C4B0]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0000CD]/20 border-t-[#0000CD]" />
      </div>
    );
  }

  // ── Vol ─────────────────────────────────────────────────────────────
  if (isFull) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#F5CDB6] via-[#FDE8DC] to-[#E8C4B0] px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[#0000CD]/10" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#0000CD] shadow-lg shadow-[#0000CD]/30">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
            </div>
          </div>
          <h1 className="mb-3 text-3xl font-bold italic text-[#0000CD] md:text-4xl">Volzet</h1>
          <p className="mb-8 leading-relaxed text-[#0000CD]/65">
            De inschrijvingen zijn gesloten. Het maximum aantal deelnemers ({MAX_REGISTRATIONS}) is bereikt.
          </p>
          <Link href="/">
            <button className="inline-flex cursor-pointer items-center justify-center rounded-full bg-[#0000CD] px-7 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#0000B0] hover:scale-[1.02] active:scale-95">
              Terug naar home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5CDB6] via-[#FDE8DC] to-[#E8C4B0]">
      <Nav />

      <section className="px-4 py-10 md:py-14">
        <div className="mx-auto max-w-5xl">

          {/* Page header */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-4xl font-bold italic text-[#0000CD] md:text-5xl">Inschrijven</h1>
            <p className="text-[#0000CD]/60">Vul het formulier in om je in te schrijven voor de wandeling</p>
          </div>

          {/* Event banner */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#0000CD]/12 bg-white/60 px-5 py-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#0000CD]/10">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0000CD" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0000CD]">Wandeling 2026</p>
                <p className="text-xs text-[#0000CD]/55">29 augustus 2026 · Citadel Diest</p>
              </div>
            </div>
            <div className="flex gap-4 text-sm">
              {spotsLeft !== null && (
                <div className="text-right">
                  <p className="font-semibold text-[#0000CD]">{spotsLeft} plaatsen</p>
                  <p className="text-xs text-[#0000CD]/55">nog beschikbaar</p>
                </div>
              )}
              <div className="text-right">
                <p className="font-semibold text-[#0000CD]">€{PRICE_PER_PERSON} / persoon</p>
                <p className="text-xs text-[#0000CD]/55">lunch inbegrepen</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-[#0000CD]">€{PRICE_PER_HAT} / petje</p>
                <p className="text-xs text-[#0000CD]/55">optioneel</p>
              </div>
            </div>
          </div>

          {/* Grid: form + sidebar */}
          <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">

            {/* ── Form card ── */}
            <form
              id="inschrijf-form"
              onSubmit={handleSubmit}
              className="rounded-2xl bg-white px-6 py-8 shadow-lg md:col-span-2 md:px-8"
            >
              {/* Section 1 — Jouw gegevens */}
              <SectionHeader number={1} title="Jouw gegevens" />
              <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="voornaam" className="mb-1.5 block text-xs font-semibold text-[#0000CD]/70">
                    Voornaam <span className="text-[#0000CD]/35">*</span>
                  </label>
                  <input
                    type="text" id="voornaam" name="voornaam" required
                    value={formData.voornaam} onChange={handleChange}
                    placeholder="Jan"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="achternaam" className="mb-1.5 block text-xs font-semibold text-[#0000CD]/70">
                    Achternaam <span className="text-[#0000CD]/35">*</span>
                  </label>
                  <input
                    type="text" id="achternaam" name="achternaam" required
                    value={formData.achternaam} onChange={handleChange}
                    placeholder="Janssen"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-[#0000CD]/70">
                    E-mailadres <span className="text-[#0000CD]/35">*</span>
                  </label>
                  <input
                    type="email" id="email" name="email" required
                    value={formData.email} onChange={handleChange}
                    placeholder="jan.janssen@voorbeeld.be"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="telefoon" className="mb-1.5 block text-xs font-semibold text-[#0000CD]/70">
                    Telefoonnummer <span className="text-[#0000CD]/35">*</span>
                  </label>
                  <input
                    type="tel" id="telefoon" name="telefoon" required
                    value={formData.telefoon} onChange={handleChange}
                    placeholder="+32 123 45 67 89"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Section 2 — Deelname */}
              <div className="mb-8 border-t border-[#0000CD]/8 pt-7">
                <SectionHeader number={2} title="Deelname" />
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <p className="mb-3 text-xs font-semibold text-[#0000CD]/70">Aantal personen</p>
                    <Stepper
                      value={formData.aantal}
                      min={1}
                      onChange={v => setFormData(f => ({ ...f, aantal: v }))}
                    />
                    <p className="mt-2 text-xs text-[#0000CD]/45">€{PRICE_PER_PERSON} p.p. · lunch inbegrepen</p>
                  </div>
                  <div>
                    <p className="mb-3 text-xs font-semibold text-[#0000CD]/70">Aantal petjes</p>
                    <Stepper
                      value={formData.petjes}
                      min={0}
                      onChange={v => setFormData(f => ({ ...f, petjes: v }))}
                    />
                    <p className="mt-2 text-xs text-[#0000CD]/45">€{PRICE_PER_HAT} per petje</p>
                  </div>
                </div>
              </div>

              {/* Section 3 — Extra's */}
              <div className="border-t border-[#0000CD]/8 pt-7">
                <SectionHeader number={3} title="Extra's" />
                <div className="space-y-5">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox" name="avondeten"
                      checked={formData.avondeten} onChange={handleChange}
                      className="mt-0.5 h-4 w-4 cursor-pointer accent-[#0000CD]"
                    />
                    <div>
                      <span className="text-sm font-semibold text-[#0000CD]">Mee-eten tijdens het avondmaal</span>
                      <p className="mt-0.5 text-xs leading-relaxed text-[#0000CD]/50">
                        Enkel een indicatie voor de organisatie — niet inbegrepen in de prijs.
                      </p>
                    </div>
                  </label>

                  <div>
                    <label htmlFor="opmerkingen" className="mb-1.5 block text-xs font-semibold text-[#0000CD]/70">
                      Opmerkingen
                    </label>
                    <textarea
                      id="opmerkingen" name="opmerkingen"
                      value={formData.opmerkingen} onChange={handleChange}
                      rows={3}
                      placeholder="Eventuele vragen of opmerkingen..."
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                </div>
              </div>
            </form>

            {/* ── Price sidebar ── */}
            <div className="md:col-span-1">
              <div className="sticky top-6 rounded-2xl bg-[#0000CD] p-6 text-white shadow-xl shadow-[#0000CD]/20">
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/50">Overzicht</p>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">{formData.aantal} {formData.aantal === 1 ? 'persoon' : 'personen'}</span>
                    <span>€{walkPrice}</span>
                  </div>
                  <div className="flex justify-between pl-3 text-xs text-white/45 italic">
                    <span>{formData.aantal}× lunch</span>
                    <span>inbegrepen</span>
                  </div>
                  {formData.petjes > 0 && (
                    <div className="flex justify-between">
                      <span className="text-white/70">{formData.petjes} {formData.petjes === 1 ? 'petje' : 'petjes'}</span>
                      <span>€{hatPrice}</span>
                    </div>
                  )}
                </div>

                <div className="my-4 border-t border-white/15" />

                <div className="mb-6 flex items-end justify-between">
                  <span className="text-sm font-semibold text-white/70">Totaal</span>
                  <span className="text-3xl font-bold">€{totalPrice}</span>
                </div>

                {error && (
                  <div className="mb-4 rounded-xl bg-white/10 px-4 py-3 text-xs text-white/90">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  form="inschrijf-form"
                  disabled={loading}
                  className="w-full cursor-pointer rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[#0000CD] shadow-md transition-all hover:scale-[1.02] hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Bezig...' : 'Bevestig inschrijving'}
                </button>

                <p className="mt-4 text-center text-[10px] text-white/35">
                  * Verplichte velden
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <footer className="px-4 py-8 text-center">
        <p className="italic text-[#0000CD]/50">
          In de schaduw van de ooievaar • Wandeling 2026
        </p>
      </footer>
    </div>
  );
}
