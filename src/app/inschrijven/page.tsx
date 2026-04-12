'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Nav from '../components/Nav';

const PRICE_PER_PERSON = 30;
const PRICE_PER_HAT = 15;

export default function Inschrijven() {
  const [formData, setFormData] = useState({
    voornaam: '',
    achternaam: '',
    email: '',
    telefoon: '',
    aantal: '1',
    petjes: '0',
    dieetwensen: '',
    opmerkingen: '',
    avondeten: false,
  });

  const [submitted, setSubmitted] = useState(false);

  const aantalPersonen = Math.max(1, parseInt(formData.aantal, 10) || 1);
  const aantalPetjes = Math.max(0, parseInt(formData.petjes, 10) || 0);
  const walkPrice = aantalPersonen * PRICE_PER_PERSON;
  const hatPrice = aantalPetjes * PRICE_PER_HAT;
  const totalPrice = walkPrice + hatPrice;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    const value = target instanceof HTMLInputElement && target.type === 'checkbox'
      ? target.checked
      : target.value;
    setFormData({
      ...formData,
      [target.name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Hier zou je de data naar een backend kunnen sturen
    console.log('Inschrijving:', formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5CDB6] via-[#FDE8DC] to-[#E8C4B0] flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border-4 border-[#0000CD]/20 text-center">
          <div className="flex justify-center mb-6">
            <Image 
              src="/logo_aaron_5.png" 
              alt="Ooievaar" 
              width={80} 
              height={80}
              className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#0000CD] mb-6 italic">
            Bedankt voor je inschrijving!
          </h1>
          <p className="text-lg text-[#0000CD]/80 mb-8">
            We hebben je inschrijving goed ontvangen. Je ontvangt binnenkort een bevestiging per e-mail met meer informatie over de wandeling.
          </p>
          <div className="bg-[#0000CD]/10 rounded-xl p-6 mb-8">
            <p className="text-[#0000CD] font-semibold">
              Tot 29 augustus 2026 bij de Citadel van Diest!
            </p>
          </div>
          <Link href="/">
            <button className="inline-flex items-center justify-center rounded-full bg-[#0000CD] px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-[#0000B8] hover:shadow-xl active:scale-95">
              Terug naar home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5CDB6] via-[#FDE8DC] to-[#E8C4B0]">
      <Nav />

      {/* Form Section */}
      <section className="px-4 py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#0000CD] mb-4 italic">
              Inschrijven
            </h1>
            <p className="text-lg text-[#0000CD]/70">
              Vul onderstaand formulier in om je in te schrijven voor de wandeling
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border-4 border-[#0000CD]/20">
            <div className="space-y-6">
              {/* Voornaam */}
              <div>
                <label htmlFor="voornaam" className="block text-[#0000CD] font-semibold mb-2">
                  Voornaam *
                </label>
                <input
                  type="text"
                  id="voornaam"
                  name="voornaam"
                  required
                  value={formData.voornaam}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#0000CD]/20 focus:border-[#0000CD] focus:outline-none focus:ring-2 focus:ring-[#0000CD]/20 transition-colors"
                  placeholder="Jan"
                />
              </div>

              {/* Achternaam */}
              <div>
                <label htmlFor="achternaam" className="block text-[#0000CD] font-semibold mb-2">
                  Achternaam *
                </label>
                <input
                  type="text"
                  id="achternaam"
                  name="achternaam"
                  required
                  value={formData.achternaam}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#0000CD]/20 focus:border-[#0000CD] focus:outline-none focus:ring-2 focus:ring-[#0000CD]/20 transition-colors"
                  placeholder="Janssen"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-[#0000CD] font-semibold mb-2">
                  E-mailadres *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#0000CD]/20 focus:border-[#0000CD] focus:outline-none focus:ring-2 focus:ring-[#0000CD]/20 transition-colors"
                  placeholder="jan.janssen@voorbeeld.be"
                />
              </div>

              {/* Telefoon */}
              <div>
                <label htmlFor="telefoon" className="block text-[#0000CD] font-semibold mb-2">
                  Telefoonnummer *
                </label>
                <input
                  type="tel"
                  id="telefoon"
                  name="telefoon"
                  required
                  value={formData.telefoon}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#0000CD]/20 focus:border-[#0000CD] focus:outline-none focus:ring-2 focus:ring-[#0000CD]/20 transition-colors"
                  placeholder="+32 123 45 67 89"
                />
              </div>

              {/* Aantal personen */}
              <div>
                <label htmlFor="aantal" className="block text-[#0000CD] font-semibold mb-2">
                  Aantal personen *
                </label>
                <input
                  type="number"
                  id="aantal"
                  name="aantal"
                  required
                  min={1}
                  value={formData.aantal}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#0000CD]/20 focus:border-[#0000CD] focus:outline-none focus:ring-2 focus:ring-[#0000CD]/20 transition-colors"
                  placeholder="1"
                />
                <p className="mt-1 text-sm text-[#0000CD]/60">€{PRICE_PER_PERSON} per persoon — lunch inbegrepen</p>
              </div>

              {/* Petjes */}
              <div>
                <label htmlFor="petjes" className="block text-[#0000CD] font-semibold mb-2">
                  Aantal petjes
                </label>
                <input
                  type="number"
                  id="petjes"
                  name="petjes"
                  min={0}
                  value={formData.petjes}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#0000CD]/20 focus:border-[#0000CD] focus:outline-none focus:ring-2 focus:ring-[#0000CD]/20 transition-colors"
                  placeholder="0"
                />
                <p className="mt-1 text-sm text-[#0000CD]/60">€{PRICE_PER_HAT} per petje</p>
              </div>

              {/* Opmerkingen */}
              <div>
                <label htmlFor="opmerkingen" className="block text-[#0000CD] font-semibold mb-2">
                  Opmerkingen
                </label>
                <textarea
                  id="opmerkingen"
                  name="opmerkingen"
                  value={formData.opmerkingen}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#0000CD]/20 focus:border-[#0000CD] focus:outline-none focus:ring-2 focus:ring-[#0000CD]/20 transition-colors resize-none"
                  placeholder="Eventuele vragen of opmerkingen..."
                />
              </div>

              {/* Avondeten */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="avondeten"
                    checked={formData.avondeten}
                    onChange={handleChange}
                    className="mt-1 h-5 w-5 rounded border-2 border-[#0000CD]/30 text-[#0000CD] accent-[#0000CD] cursor-pointer"
                  />
                  <div>
                    <span className="text-[#0000CD] font-semibold">
                      Ik wil graag mee-eten tijdens het avondmaal
                    </span>
                    <p className="mt-1 text-sm text-[#0000CD]/60">
                      Het avondeten is niet inbegrepen in de inschrijvingsprijs. Dit is enkel een indicatie voor de organisatie om de juiste hoeveelheid eten te voorzien.
                    </p>
                  </div>
                </label>
              </div>

              {/* Prijsberekening */}
              <div className="rounded-xl border-2 border-[#0000CD]/20 bg-[#0000CD]/5 p-5">
                <p className="text-[#0000CD] font-semibold mb-3">Totaalprijs</p>
                <div className="space-y-1 text-sm text-[#0000CD]/70">
                  <div className="flex justify-between">
                    <span>{aantalPersonen} {aantalPersonen === 1 ? 'persoon' : 'personen'} × €{PRICE_PER_PERSON}</span>
                    <span>€{walkPrice}</span>
                  </div>
                  <div className="flex justify-between pl-4 text-[#0000CD]/50 italic">
                    <span>{aantalPersonen} × lunch</span>
                    <span>inbegrepen</span>
                  </div>
                  {aantalPetjes > 0 && (
                    <div className="flex justify-between">
                      <span>{aantalPetjes} {aantalPetjes === 1 ? 'petje' : 'petjes'} × €{PRICE_PER_HAT}</span>
                      <span>€{hatPrice}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#0000CD]/20">
                  <span className="text-[#0000CD] font-semibold">Totaal</span>
                  <p className="text-3xl font-bold text-[#0000CD]">
                    €{totalPrice}
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center rounded-full bg-[#0000CD] px-8 py-5 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-[#0000B8] hover:shadow-xl active:scale-95"
                >
                  Bevestig inschrijving
                </button>
              </div>

              <p className="text-sm text-[#0000CD]/60 text-center">
                * Verplichte velden
              </p>
            </div>
          </form>
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
