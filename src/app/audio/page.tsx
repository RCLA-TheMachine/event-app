'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Nav from '../components/Nav';

const BAR_COUNT = 60;

function WaveformBars({ playing }: { playing: boolean }) {
  // Generate stable random heights once per mount
  const bars = useMemo(
    () =>
      Array.from({ length: BAR_COUNT }, () => ({
        min: 4 + Math.random() * 8,
        max: 20 + Math.random() * 36,
        delay: Math.random() * 0.9,
        duration: 0.55 + Math.random() * 0.6,
      })),
    [],
  );

  return (
    <div className="flex w-full items-center justify-between gap-[2px] h-16">
      <style>{`
        @keyframes wavebar {
          0%, 100% { transform: scaleY(var(--scale-min)); opacity: 0.45; }
          50%       { transform: scaleY(var(--scale-max)); opacity: 1; }
        }
      `}</style>
      {bars.map((b, i) => (
        <span
          key={i}
          className="inline-block w-[3px] rounded-full bg-white origin-center"
          style={{
            height: '36px',
            transform: `scaleY(${playing ? b.max / 36 : b.min / 36})`,
            animation: playing
              ? `wavebar ${b.duration.toFixed(2)}s ease-in-out ${b.delay.toFixed(2)}s infinite`
              : 'none',
            transition: playing ? 'none' : 'transform 0.4s ease',
            '--scale-min': (b.min / 36).toFixed(2),
            '--scale-max': (b.max / 36).toFixed(2),
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

function formatTime(secs: number) {
  if (!isFinite(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const sliderStyle = (fill: number): React.CSSProperties => ({
  background: `linear-gradient(to right, #0000CD ${fill}%, rgba(0,0,205,0.15) ${fill}%)`,
  borderRadius: '9999px',
  height: '3px',
  outline: 'none',
  cursor: 'pointer',
  WebkitAppearance: 'none',
});

export default function AudioPage() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [showVolume, setShowVolume] = useState(false);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    playing ? audio.pause() : audio.play();
    setPlaying((p) => !p);
  }, [playing]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onLoaded = () => setDuration(audio.duration);
    const onEnded = () => setPlaying(false);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('ended', onEnded);
    audio.volume = volume;
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('ended', onEnded);
    };
  }, [volume]);

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = Number(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = t;
    setCurrentTime(t);
  };

  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setVolume(v);
    if (audioRef.current) {
      audioRef.current.volume = v;
      audioRef.current.muted = v === 0;
    }
    setMuted(v === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = !muted;
    audio.muted = next;
    setMuted(next);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const volFill = (muted ? 0 : volume) * 100;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.95),_rgba(245,205,182,0.88)_28%,_rgba(232,196,176,1)_70%)]">
      {/* Decorative blobs */}
      <div className="absolute -left-24 top-16 h-80 w-80 rounded-full bg-white/50 blur-3xl" />
      <div className="absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-[#0000CD]/10 blur-3xl" />

      <Nav />

      {/* Player */}
      <main className="relative flex min-h-[calc(100vh-88px)] items-center justify-center px-4 pb-16">
        <div className="w-full max-w-2xl">
          {/* Title */}
          <div className="mb-8 flex flex-col items-center text-center">
            <h1 className="text-4xl font-bold italic tracking-tight text-[#0000CD] sm:text-5xl md:text-6xl lg:text-7xl">
              Audio fragment
            </h1>
            <p className="mt-4 text-lg text-[#0000CD]/70 md:text-xl">
              Luister naar de sfeer van de wandeling
            </p>
          </div>
          {/* Single unified card */}
          <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_30px_80px_rgba(0,0,205,0.14)] backdrop-blur-xl">

            {/* Waveform area */}
            <div className="relative bg-[#0000CD] px-7 py-8">
              {/* Glow ring that appears while playing */}
              <div
                className="pointer-events-none absolute inset-0 transition-opacity duration-500"
                style={{ opacity: playing ? 1 : 0 }}
              >
                <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-2xl" />
              </div>
              <WaveformBars playing={playing} />
            </div>

            {/* Controls area */}
            <div className="px-7 py-7">
              {/* Scrubber */}
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.1}
                value={currentTime}
                onChange={seek}
                className="w-full"
                style={sliderStyle(progress)}
              />
              <div className="mt-2 mb-7 flex justify-between text-[11px] font-medium tabular-nums text-[#0000CD]/45">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>

              {/* Play / Pause + volume row */}
              <div className="flex items-center justify-between">
                {/* Spacer left (mirrors volume button for centering) */}
                <div className="w-9" />

                {/* Play / Pause */}
                <button
                  onClick={toggle}
                  aria-label={playing ? 'Pauzeer' : 'Speel af'}
                  className="group relative flex h-[64px] w-[64px] items-center justify-center rounded-full bg-[#0000CD] text-white shadow-[0_8px_28px_rgba(0,0,205,0.38)] transition-all duration-200 hover:scale-105 hover:bg-[#0000b8] active:scale-95"
                >
                  <span
                    className="absolute inset-0 rounded-full ring-2 ring-[#0000CD]/25 transition-all duration-300 group-hover:ring-[#0000CD]/45"
                    style={{ transform: playing ? 'scale(1.2)' : 'scale(1.1)' }}
                  />
                  {playing ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="5" y="3" width="4" height="18" rx="1.5" />
                      <rect x="15" y="3" width="4" height="18" rx="1.5" />
                    </svg>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 4.5l13 7.5-13 7.5V4.5z" />
                    </svg>
                  )}
                </button>

                {/* Volume toggle button */}
                <div className="relative">
                  <button
                    onClick={() => setShowVolume((v) => !v)}
                    aria-label="Volume"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#0000CD]/15 bg-[#0000CD]/5 text-[#0000CD]/60 transition hover:bg-[#0000CD]/10 hover:text-[#0000CD]"
                  >
                    {muted || volume === 0 ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3.63 3.63a1 1 0 011.41 0L19.07 17.07a1 1 0 01-1.41 1.41L3.63 5.04a1 1 0 010-1.41zM13 4.13V7.4l-2-2V4.13a1 1 0 012 0zM3 9h3.17L13 15.83V19.87a1 1 0 01-1.71.71L7 16.41 3 16.41A1 1 0 012 15.41v-5.41A1 1 0 013 9z" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 7.97v8.05A4.5 4.5 0 0016.5 12zM14 3.23v2.06a7 7 0 010 13.42v2.06A9 9 0 0014 3.23z" />
                      </svg>
                    )}
                  </button>

                  {/* Horizontal pop-up volume slider */}
                  <div
                    className="absolute bottom-full right-0 mb-3 flex items-center gap-2 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-[0_8px_32px_rgba(0,0,205,0.12)] backdrop-blur-xl transition-all duration-200"
                    style={{
                      opacity: showVolume ? 1 : 0,
                      pointerEvents: showVolume ? 'auto' : 'none',
                      transform: showVolume ? 'translateY(0) scale(1)' : 'translateY(6px) scale(0.97)',
                    }}
                  >
                    {/* Mute toggle inside popup */}
                    <button
                      onClick={toggleMute}
                      className="shrink-0 text-[#0000CD]/50 transition hover:text-[#0000CD]"
                      aria-label="Dempen"
                    >
                      {muted || volume === 0 ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3.63 3.63a1 1 0 011.41 0L19.07 17.07a1 1 0 01-1.41 1.41L3.63 5.04a1 1 0 010-1.41zM13 4.13V7.4l-2-2V4.13a1 1 0 012 0zM3 9h3.17L13 15.83V19.87a1 1 0 01-1.71.71L7 16.41 3 16.41A1 1 0 012 15.41v-5.41A1 1 0 013 9z" />
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3 9v6h4l5 5V4L7 9H3zm10 8.66V6.34a5 5 0 010 11.32z" />
                        </svg>
                      )}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.02}
                      value={muted ? 0 : volume}
                      onChange={changeVolume}
                      className="w-28"
                      style={sliderStyle(volFill)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <audio ref={audioRef} src="/guitar.mp3" preload="metadata" />

      {/* Footer */}
      <footer className="relative px-4 py-8 text-center">
        <p className="text-[#0000CD]/60 italic">
          In de schaduw van de ooievaar • Wandeling 2026
        </p>
      </footer>
    </div>
  );
}
