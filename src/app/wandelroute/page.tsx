'use client';

import { useCallback, useEffect, useRef, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import 'leaflet/dist/leaflet.css';

type RoutePoint = {
  id: number;
  number: number;
  title: string;
  description: string;
  lat: number;
  lng: number;
  spotifyUrl: string;
  // Real Spotify track id -> renders the inline embed player instead of the plain link.
  // Leave unset for points that don't have a real track yet.
  spotifyEmbedId?: string;
};

const EVENT_DATE = new Date('2026-08-29T00:00:00');
const isEventDay = () => Date.now() >= EVENT_DATE.getTime();

// DEV ONLY: keeps the Spotify links clickable while we're building/testing.
// Set back to false before the event so links stay locked until isEventDay().
const DEV_UNLOCK_SPOTIFY_LINKS = true;

const GPX_PATH = '/gpx/wandelroute-idsvdo.gpx';

async function loadGpxTrack(url: string): Promise<[number, number][]> {
  const res = await fetch(url);
  const text = await res.text();
  const doc = new DOMParser().parseFromString(text, 'text/xml');
  return Array.from(doc.getElementsByTagName('trkpt')).map((pt) => [
    parseFloat(pt.getAttribute('lat')!),
    parseFloat(pt.getAttribute('lon')!),
  ]);
}

const ROUTE_POINTS: RoutePoint[] = [
  {
    id: 1, number: 1,
    title: 'Citadel — start en eindpunt',
    description: 'Het vertrek- en aankomstpunt van de wandeling: de imposante Citadel van Diest.',
    lat: 50.983466, lng: 5.046139,
    spotifyUrl: 'https://open.spotify.com/track/1MoA0TNVdveasxnR6c2JqZ',
    spotifyEmbedId: '1MoA0TNVdveasxnR6c2JqZ',
  },
  {
    id: 2, number: 2,
    title: 'Park Cerckel - 2,5 km',
    description: 'We wandelen door het groene Park Cerckel, een rustige groene site in het midden van de stad.',
    lat: 50.986722, lng: 5.050972,
    // TODO: replace with the real Spotify track link for this point
    spotifyUrl: 'https://open.spotify.com/track/REPLACE_ME',
  },
  {
    id: 3, number: 3,
    title: 'Boerenkrijgplein - 4,1 km',
    description: 'Historische kanonnen met zicht op het water.',
    lat: 50.989544, lng: 5.063342,
    // TODO: replace with the real Spotify track link for this point
    spotifyUrl: 'https://open.spotify.com/track/REPLACE_ME',
  },
  {
    id: 4, number: 4,
    title: 'Bankje Wallen - 4,6 km',
    description: 'Een rustig bankje vlak bij het zwembad van Diest',
    lat: 50.987034, lng: 5.063065,
    // TODO: replace with the real Spotify track link for this point
    spotifyUrl: 'https://open.spotify.com/track/REPLACE_ME',
  },
  {
    id: 5, number: 5,
    title: 'Ooievaarsnesten en losloopweide- 5 km',
    description: 'Hondenlosloopweide en ooievaarsnesten, in het Webbkoms Broek',
    lat: 50.988205, lng: 5.065631,
    // TODO: replace with the real Spotify track link for this point
    spotifyUrl: 'https://open.spotify.com/track/2VxeLyX666F8uXCJ0dZF8B?si=123707e3466047fe',
  },
  {
    id: 6, number: 6,
    title: 'Herdenkingsbankje Aaron - 5,9 km',
    description: 'Aan het ouderlijk huis bij Luc en An.',
    lat: 50.987418, lng: 5.061068,
    // TODO: replace with the real Spotify track link for this point
    spotifyUrl: 'https://open.spotify.com/track/REPLACE_ME',
  },
  {
    id: 7, number: 7,
    title: 'Amfitheater — 6,15 km',
    description: 'Het amfitheater aan het begin van de Warande.',
    lat: 50.985661, lng: 5.059276,
    // TODO: replace with the real Spotify track link for this point
    spotifyUrl: 'https://open.spotify.com/track/REPLACE_ME',
  },
  {
    id: 8, number: 8,
    title: 'Witte poort warande — 6,8 km',
    description: 'We wandelen door domein de Warande',
    lat: 50.984162, lng: 5.055469,
    // TODO: replace with the real Spotify track link for this point
    spotifyUrl: 'https://open.spotify.com/track/REPLACE_ME',
  },
  {
    id: 9, number: 9,
    title: 'Scoutslokalen Sint-Jan — 7,2 km',
    description: 'Langs de scoutslokalen',
    lat: 50.982481, lng: 5.055274,
    // TODO: replace with the real Spotify track link for this point
    spotifyUrl: 'https://open.spotify.com/track/REPLACE_ME',
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makeMarkerIcon(L: any, number: number, selected: boolean) {
  const size = selected ? 40 : 32;
  const fontSize = selected ? 15 : 13;
  const border = selected ? '3px solid white' : '2.5px solid white';
  const shadow = selected
    ? '0 4px 16px rgba(0,0,205,0.55), 0 0 0 4px rgba(0,0,205,0.15)'
    : '0 2px 8px rgba(0,0,205,0.35)';

  return L.divIcon({
    className: '',
    html: `<div style="
      width:${size}px;height:${size}px;
      background:#0000CD;
      border-radius:50%;
      border:${border};
      box-shadow:${shadow};
      display:flex;align-items:center;justify-content:center;
      color:white;font-size:${fontSize}px;font-weight:700;
      font-family:system-ui,sans-serif;
      cursor:pointer;
      transition:all 0.15s ease;
    ">${number}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function computeBearing(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const toDeg = (v: number) => (v * 180) / Math.PI;
  const dLng = toRad(lng2 - lng1);
  const y = Math.sin(dLng) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makeArrowIcon(L: any, bearingDeg: number) {
  const size = 18;
  return L.divIcon({
    className: '',
    html: `<div style="
      width:${size}px;height:${size}px;
      display:flex;align-items:center;justify-content:center;
      transform:rotate(${bearingDeg}deg);
    ">
      <div style="
        width:15px;height:15px;
        background:white;
        border-radius:50%;
        display:flex;align-items:center;justify-content:center;
        box-shadow:0 1px 4px rgba(0,0,205,0.4), 0 0 0 1px rgba(0,0,205,0.25);
      ">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="#0000CD" style="margin-top:-1px;">
          <path d="M12 2 L20 20 L12 15.5 L4 20 Z" />
        </svg>
      </div>
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function WandelRouteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<Map<number, any>>(new Map());

  const initialId = Number(searchParams.get('punt'));
  const [selected, setSelected] = useState<RoutePoint | null>(
    () => ROUTE_POINTS.find((p) => p.id === initialId) ?? null
  );

  const selectPoint = useCallback((point: RoutePoint | null) => {
    setSelected(point);
    if (point) {
      router.replace(`/wandelroute?punt=${point.id}`, { scroll: false });
    } else {
      router.replace('/wandelroute', { scroll: false });
    }
  }, [router]);

  const spotifyLinkRef = useRef<HTMLDivElement>(null);
  const [spotifyTooltipPos, setSpotifyTooltipPos] = useState<{ top: number; left: number } | null>(null);

  const showSpotifyTooltip = useCallback(() => {
    const rect = spotifyLinkRef.current?.getBoundingClientRect();
    if (!rect) return;
    setSpotifyTooltipPos({ top: rect.top, left: rect.left + rect.width / 2 });
  }, []);

  const hideSpotifyTooltip = useCallback(() => setSpotifyTooltipPos(null), []);

  const spotifyUnlocked = DEV_UNLOCK_SPOTIFY_LINKS || isEventDay();

  // Init map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;
    let alive = true;

    (async () => {
      const L = (await import('leaflet')).default;
      if (!alive || !mapContainerRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: [50.9862, 5.0540],
        zoom: 15,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20,
      }).addTo(map);

      // Actual walked route, from the GPX track
      loadGpxTrack(GPX_PATH).then((coords) => {
        if (!alive || coords.length === 0) return;
        const routeLine = L.polyline(coords, {
          color: '#0000CD',
          weight: 4,
          opacity: 0.55,
        }).addTo(map);

        // Frame the whole route, unless the user deep-linked to a specific point
        if (!selected) {
          map.fitBounds(routeLine.getBounds(), { padding: [32, 32] });
        }

        // Direction arrows, evenly spaced by real-world distance along the track
        const ARROW_SPACING_M = 600;
        const LOOKAHEAD = 5;
        const cumulative = [0];
        for (let i = 1; i < coords.length; i++) {
          cumulative.push(
            cumulative[i - 1] +
              haversineMeters(coords[i - 1][0], coords[i - 1][1], coords[i][0], coords[i][1])
          );
        }
        const totalLength = cumulative[cumulative.length - 1];
        for (let dist = ARROW_SPACING_M; dist < totalLength; dist += ARROW_SPACING_M) {
          const idx = cumulative.findIndex((d) => d >= dist);
          if (idx <= 0) continue;
          const aheadIdx = Math.min(idx + LOOKAHEAD, coords.length - 1);
          if (aheadIdx === idx) continue;
          const bearing = computeBearing(
            coords[idx][0], coords[idx][1],
            coords[aheadIdx][0], coords[aheadIdx][1]
          );
          L.marker(coords[idx], {
            icon: makeArrowIcon(L, bearing),
            interactive: false,
            keyboard: false,
          }).addTo(map);
        }
      });

      // Markers
      ROUTE_POINTS.forEach((point) => {
        const marker = L.marker([point.lat, point.lng], {
          icon: makeMarkerIcon(L, point.number, false),
        }).addTo(map);
        marker.on('click', () => selectPoint(point));
        markersRef.current.set(point.id, marker);
      });

      mapInstanceRef.current = map;

      // If a point was pre-selected via URL, pan to it
      if (selected) {
        map.setView([selected.lat, selected.lng], 16);
      }
    })();

    return () => {
      alive = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersRef.current.clear();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update marker icons when selection changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    import('leaflet').then(({ default: L }) => {
      markersRef.current.forEach((marker, id) => {
        const point = ROUTE_POINTS.find((p) => p.id === id)!;
        marker.setIcon(makeMarkerIcon(L, point.number, selected?.id === id));
      });
    });
  }, [selected]);

  const closePanel = useCallback(() => {
    selectPoint(null);
  }, [selectPoint]);

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-[#FBF0E9]">
      <div className="relative flex-1">
        {/* Map */}
        <div ref={mapContainerRef} className="absolute inset-0" />

        {/* Mobile home + GPX buttons */}
        <div className="absolute left-3 top-3 z-[1000] flex gap-2 md:hidden">
          <Link
            href="/"
            aria-label="Naar startpagina"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0000CD]/15 bg-white/90 text-[#0000CD]/60 shadow-md backdrop-blur-sm transition-colors hover:bg-white hover:text-[#0000CD]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" />
              <path d="M9 21V12h6v9" />
            </svg>
          </Link>
          <Link
            href="/wandelroute/gpx"
            aria-label="GPX-bestand downloaden"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0000CD]/15 bg-white/90 text-[#0000CD]/60 shadow-md backdrop-blur-sm transition-colors hover:bg-white hover:text-[#0000CD]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3v13m0 0l-4.5-4.5M12 16l4.5-4.5" />
              <path d="M4 19h16" />
            </svg>
          </Link>
        </div>

        {/* Legend overlay */}
        <div className="absolute left-3 top-3 z-[1000] hidden md:block">
          <div className="rounded-xl border border-[#0000CD]/10 bg-white/90 px-4 py-3 shadow-lg backdrop-blur-sm">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0000CD]/50">
              Wandelroute
            </p>
            <div className="space-y-1.5">
              {ROUTE_POINTS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => selectPoint(p)}
                  className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1 text-left text-sm transition-colors ${
                    selected?.id === p.id
                      ? 'bg-[#0000CD]/8 text-[#0000CD]'
                      : 'text-[#0000CD]/65 hover:bg-[#0000CD]/5 hover:text-[#0000CD]'
                  }`}
                >
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#0000CD] text-[10px] font-bold text-white">
                    {p.number}
                  </span>
                  <span className="truncate font-medium">{p.title.split(' — ')[0]}</span>
                </button>
              ))}
            </div>
            <div className="mt-3 space-y-0.5 border-t border-[#0000CD]/10 pt-2.5">
              <Link
                href="/wandelroute/gpx"
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1 text-left text-sm font-medium text-[#0000CD]/55 transition-colors hover:bg-[#0000CD]/5 hover:text-[#0000CD]"
              >
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 3v13m0 0l-4.5-4.5M12 16l4.5-4.5" />
                    <path d="M4 19h16" />
                  </svg>
                </span>
                Download GPX
              </Link>
              <Link
                href="/"
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1 text-left text-sm font-medium text-[#0000CD]/55 transition-colors hover:bg-[#0000CD]/5 hover:text-[#0000CD]"
              >
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" />
                    <path d="M9 21V12h6v9" />
                  </svg>
                </span>
                Startpagina
              </Link>
            </div>
          </div>
        </div>

        {/* Point panel — slides up from bottom */}
        <div
          className={`absolute bottom-0 left-0 right-0 z-[1000] transition-all duration-300 ease-out ${
            selected ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
          }`}
        >
          {selected && (
            <div className="mx-3 mb-4 overflow-hidden rounded-2xl border border-[#0000CD]/10 bg-white/96 shadow-2xl backdrop-blur-md md:mx-auto md:max-w-xl">
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="h-1 w-10 rounded-full bg-[#0000CD]/15" />
              </div>

              <div className="px-5 pb-5 pt-2">
                {/* Header */}
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#0000CD] shadow-md shadow-[#0000CD]/25">
                    <span className="text-sm font-bold text-white">{selected.number}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#0000CD] leading-snug">{selected.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#0000CD]/55">{selected.description}</p>
                  </div>
                  <button
                    onClick={closePanel}
                    aria-label="Sluiten"
                    className="flex h-8 w-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-full text-[#0000CD]/40 transition-colors hover:bg-[#0000CD]/8 hover:text-[#0000CD]/70"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Spotify link */}
                <div
                  ref={spotifyLinkRef}
                  className="mt-4"
                  onMouseEnter={!spotifyUnlocked ? showSpotifyTooltip : undefined}
                  onMouseLeave={!spotifyUnlocked ? hideSpotifyTooltip : undefined}
                >
                  {spotifyUnlocked ? (
                    selected.spotifyEmbedId ? (
                      <iframe
                        key={selected.spotifyEmbedId}
                        title={`Spotify: ${selected.title}`}
                        style={{ borderRadius: 12, border: 0 }}
                        src={`https://open.spotify.com/embed/track/${selected.spotifyEmbedId}?utm_source=generator`}
                        width="100%"
                        height="152"
                        allowFullScreen
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                      />
                    ) : (
                    <a
                      href={selected.spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center gap-3 rounded-full bg-[#1DB954] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#1DB954]/25 transition-all hover:bg-[#1ED760] hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="flex-shrink-0">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.36-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
                      </svg>
                      <span className="flex-1 text-left">Beluister op Spotify</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="flex-shrink-0">
                        <path d="M7 17L17 7M7 7h10v10" />
                      </svg>
                    </a>
                    )
                  ) : (
                    <button
                      disabled
                      aria-label="Spotify-link nog niet beschikbaar"
                      className="flex w-full cursor-not-allowed items-center gap-3 rounded-full bg-[#1DB954]/35 px-4 py-3 text-sm font-semibold text-white/80"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="flex-shrink-0">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.36-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
                      </svg>
                      <span className="flex-1 text-left">Beluister op Spotify</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="flex-shrink-0">
                        <rect x="5" y="11" width="14" height="9" rx="1.5" />
                        <path d="M8 11V7a4 4 0 1 1 8 0v4" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Navigation between points */}
                <div className="mt-4 flex items-center justify-between border-t border-[#0000CD]/8 pt-3">
                  <div className="flex items-center gap-1">
                    <Link
                      href="/"
                      aria-label="Naar startpagina"
                      className="flex cursor-pointer items-center justify-center rounded-full p-1.5 text-[#0000CD]/55 transition-colors hover:bg-[#0000CD]/6 hover:text-[#0000CD]"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" />
                        <path d="M9 21V12h6v9" />
                      </svg>
                    </Link>
                    <div className="mx-1 h-3.5 w-px bg-[#0000CD]/15" />
                    <button
                      onClick={() => {
                        const idx = ROUTE_POINTS.findIndex((p) => p.id === selected.id);
                        if (idx > 0) selectPoint(ROUTE_POINTS[idx - 1]);
                      }}
                      disabled={ROUTE_POINTS[0].id === selected.id}
                      aria-label="Vorig punt"
                      className="flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-[#0000CD]/55 transition-colors hover:bg-[#0000CD]/6 hover:text-[#0000CD] disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                      Vorig
                    </button>
                  </div>

                  <span className="text-xs text-[#0000CD]/35">
                    {ROUTE_POINTS.findIndex((p) => p.id === selected.id) + 1} / {ROUTE_POINTS.length}
                  </span>

                  <button
                    onClick={() => {
                      const idx = ROUTE_POINTS.findIndex((p) => p.id === selected.id);
                      if (idx < ROUTE_POINTS.length - 1) selectPoint(ROUTE_POINTS[idx + 1]);
                    }}
                    disabled={ROUTE_POINTS[ROUTE_POINTS.length - 1].id === selected.id}
                    aria-label="Volgend punt"
                    className="flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-[#0000CD]/55 transition-colors hover:bg-[#0000CD]/6 hover:text-[#0000CD] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Volgend
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Spotify link tooltip — rendered outside the panel so it's never clipped */}
        {spotifyTooltipPos && (
          <div
            className="pointer-events-none fixed z-[2000] w-48 -translate-x-1/2 -translate-y-[calc(100%+8px)] rounded-lg bg-[#0000CD] px-3 py-2 text-center text-xs font-medium text-white shadow-lg"
            style={{ top: spotifyTooltipPos.top, left: spotifyTooltipPos.left }}
          >
            Deze link wordt geactiveerd op de dag van de wandeling
            <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-[#0000CD]" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function WandelRoutePage() {
  return (
    <Suspense>
      <WandelRouteContent />
    </Suspense>
  );
}
