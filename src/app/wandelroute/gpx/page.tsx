import Link from 'next/link';

const GPX_PATH = '/gpx/wandelroute-idsvdo.gpx';

const APPS = [
  {
    name: 'Komoot',
    steps: 'Open Komoot → Planner → importeer bestand → kies het gedownloade GPX-bestand.',
  },
  {
    name: 'Strava',
    steps: 'Open Strava → Training → Routes → Route maken → importeer GPX-bestand.',
  },
];

export default function GpxDownloadPage() {
  return (
    <div className="min-h-[100dvh] bg-[#FBF0E9] px-4 py-10">
      <div className="mx-auto max-w-xl">
        <Link
          href="/wandelroute"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-[#0000CD]/60 transition-colors hover:text-[#0000CD]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Terug naar de wandelroute
        </Link>

        <div className="rounded-2xl border border-[#0000CD]/10 bg-white/90 p-6 shadow-lg backdrop-blur-sm md:p-8">
          <h1 className="text-xl font-bold text-[#0000CD] md:text-2xl">
            Download de route (GPX)
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#0000CD]/60">
            Wil je de wandelroute volgen op je smartphone of GPS-toestel? Download het GPX-bestand
            hieronder en open het in je favoriete wandel- of fietsapp.
          </p>

          <a
            href={GPX_PATH}
            download
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0000CD] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#0000B8] hover:shadow-lg active:scale-95"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3v13m0 0l-4.5-4.5M12 16l4.5-4.5" />
              <path d="M4 19h16" />
            </svg>
            Download GPX-bestand
          </a>

          <div className="mt-8 border-t border-[#0000CD]/8 pt-6">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0000CD]/50">
              Hoe open ik dit bestand?
            </p>
            <ul className="space-y-3">
              {APPS.map((app) => (
                <li key={app.name} className="text-sm leading-relaxed">
                  <span className="font-semibold text-[#0000CD]">{app.name}: </span>
                  <span className="text-[#0000CD]/60">{app.steps}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-[#0000CD]/45">
              Werkt je app niet met GPX-bestanden? De meeste wandel- en fietsapps ondersteunen dit
              formaat rechtstreeks via een &quot;importeren&quot; of &quot;route toevoegen&quot;-optie.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
