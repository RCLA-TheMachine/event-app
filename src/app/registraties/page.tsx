'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

type Inschrijving = {
  id: number;
  created_at: string;
  voornaam: string;
  achternaam: string;
  email: string;
  telefoon: string;
  aantal: number;
  petjes: number;
  avondeten: boolean;
  opmerkingen: string | null;
  totaalprijs: number;
};

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-[#0000CD]/10 bg-white px-5 py-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0000CD]/40">{label}</p>
      <p className="mt-1 text-2xl font-bold text-[#0000CD]">{value}</p>
    </div>
  );
}

export default function RegistratiesPage() {
  const [rows, setRows] = useState<Inschrijving[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('inschrijvingen')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError('Kon registraties niet laden: ' + error.message);
    } else {
      setRows(data ?? []);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const totalPersonen = rows.reduce((s, r) => s + r.aantal, 0);
  const totalPetjes = rows.reduce((s, r) => s + r.petjes, 0);
  const totalAvondeten = rows.filter(r => r.avondeten).length;
  const totalOmzet = rows.reduce((s, r) => s + r.totaalprijs, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5CDB6] via-[#FDE8DC] to-[#E8C4B0] px-4 py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0000CD]/40">Beheer</p>
            <h1 className="text-3xl font-bold italic text-[#0000CD]">Registraties</h1>
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="flex cursor-pointer items-center gap-2 rounded-full border border-[#0000CD]/20 bg-white/70 px-4 py-2 text-sm font-medium text-[#0000CD] shadow-sm backdrop-blur-sm transition-all hover:bg-white disabled:opacity-50"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={loading ? 'animate-spin' : ''} aria-hidden="true">
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
            Vernieuwen
          </button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
          <StatCard label="Inschrijvingen" value={rows.length} />
          <StatCard label="Personen" value={totalPersonen} />
          <StatCard label="Petjes" value={totalPetjes} />
          <StatCard label="Avondeten" value={totalAvondeten} />
          <StatCard label="Totaal omzet" value={`€${totalOmzet}`} />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-[#0000CD]/10 bg-white shadow-sm">
          {loading && rows.length === 0 ? (
            <div className="flex items-center justify-center py-20 text-sm text-[#0000CD]/40">
              Laden…
            </div>
          ) : rows.length === 0 ? (
            <div className="flex items-center justify-center py-20 text-sm text-[#0000CD]/40">
              Nog geen registraties.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#0000CD]/8 bg-[#0000CD]/4">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#0000CD]/50">Naam</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#0000CD]/50">E-mail</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#0000CD]/50">Telefoon</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-[#0000CD]/50">Personen</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-[#0000CD]/50">Petjes</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-[#0000CD]/50">Avondeten</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.14em] text-[#0000CD]/50">Totaal</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#0000CD]/50">Opmerkingen</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#0000CD]/50">Datum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0000CD]/6">
                  {rows.map((r) => (
                    <tr key={r.id} className="transition-colors hover:bg-[#0000CD]/3">
                      <td className="px-4 py-3 font-medium text-[#0000CD]">
                        {r.voornaam} {r.achternaam}
                      </td>
                      <td className="px-4 py-3 text-[#0000CD]/70">{r.email}</td>
                      <td className="px-4 py-3 text-[#0000CD]/70">{r.telefoon}</td>
                      <td className="px-4 py-3 text-center tabular-nums text-[#0000CD]">{r.aantal}</td>
                      <td className="px-4 py-3 text-center tabular-nums text-[#0000CD]">{r.petjes}</td>
                      <td className="px-4 py-3 text-center">
                        {r.avondeten
                          ? <span className="inline-block rounded-full bg-[#0000CD]/10 px-2.5 py-0.5 text-xs font-semibold text-[#0000CD]">Ja</span>
                          : <span className="text-[#0000CD]/25">—</span>
                        }
                      </td>
                      <td className="px-4 py-3 text-right font-semibold tabular-nums text-[#0000CD]">€{r.totaalprijs}</td>
                      <td className="max-w-[180px] px-4 py-3 text-[#0000CD]/55">
                        {r.opmerkingen
                          ? <span title={r.opmerkingen} className="block truncate">{r.opmerkingen}</span>
                          : <span className="text-[#0000CD]/25">—</span>
                        }
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-[#0000CD]/45">
                        {new Date(r.created_at).toLocaleDateString('nl-BE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
