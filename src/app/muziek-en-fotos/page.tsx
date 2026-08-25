'use client';

import Nav from '../components/Nav';

const SPOTIFY_PLAYLIST_URL = 'https://open.spotify.com/playlist/3q9ak7XUtHOHfeeAalEKEi';
const EVENTPIX_URL = 'https://www.eventpix.photo/upload/hlWb5_wcg6m3SifM8B2A3g';

function SpotifyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.36-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 8a2 2 0 0 1 2-2h1.5l1-1.5h7l1 1.5H18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}

export default function MuziekEnFotos() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5CDB6] via-[#FDE8DC] to-[#E8C4B0]">
      <Nav />

      <main className="mx-auto max-w-3xl px-4 pb-20 pt-4 sm:pt-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="mb-4 text-4xl font-bold italic tracking-tight text-[#0000CD] sm:text-5xl md:text-6xl">
            Muziek &amp; foto&apos;s
          </h1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-[#0000CD]/70 sm:text-lg">
            Op de dag zelf bouwen we samen de sfeer op: zet jouw favoriete nummer op de playlist
            en deel je foto&apos;s met de groep.
          </p>
        </div>

        {/* Playlist */}
        <div className="mb-6 rounded-2xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-8">
          <h2 className="mb-3 text-xl font-bold text-[#0000CD] sm:text-2xl">
            Zet een nummer op de playlist
          </h2>
          <p className="mb-3 leading-relaxed text-[#0000CD]/70">
            We wandelen op de tonen van een gezamenlijke Spotify-playlist. Iedereen mag
            nummers toevoegen:
          </p>
          <ol className="mb-5 list-decimal space-y-1.5 pl-5 leading-relaxed text-[#0000CD]/70">
            <li>Open de playlist via de knop hieronder.</li>
            <li>Tik op &quot;Volgen&quot; zodat je zelf nummers kan toevoegen.</li>
            <li>Zoek je nummer op, tik op de drie puntjes en kies &quot;Toevoegen aan deze playlist&quot;.</li>
          </ol>
          <a
            href={SPOTIFY_PLAYLIST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#0000CD] px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#0000B8] hover:shadow-lg active:scale-95 subpixel-antialiased"
          >
            <SpotifyIcon />
            Open de playlist
          </a>
        </div>

        {/* EventPix */}
        <div className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-8">
          <h2 className="mb-3 text-xl font-bold text-[#0000CD] sm:text-2xl">
            Deel je foto&apos;s via EventPix
          </h2>
          <p className="mb-3 leading-relaxed text-[#0000CD]/70">
            Via EventPix verzamelen we alle foto&apos;s van de dag op één gedeeld album:
          </p>
          <ol className="mb-5 list-decimal space-y-1.5 pl-5 leading-relaxed text-[#0000CD]/70">
            <li>Open EventPix via de knop hieronder, of scan de QR-code op locatie.</li>
            <li>Maak een nieuwe foto of upload er een uit je gallerij.</li>
            <li>Klaar — je foto staat automatisch in het gedeelde album voor iedereen.</li>
          </ol>
          <a
            href={EVENTPIX_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#0000CD] px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#0000B8] hover:shadow-lg active:scale-95 subpixel-antialiased"
          >
            <CameraIcon />
            Open EventPix
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
