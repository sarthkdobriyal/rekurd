"use client";

import useSongScan from "@/hooks/useSongScan";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Loader2, Music2, SearchX, X } from "lucide-react";
import Image from "next/image";
import TrackResult from "./_components/TrackResult";
import type { ScannedTrack } from "@/lib/types";

const CORAL = "oklch(62% 0.2 28)";

const BAR_COUNT = 194;
const BARS = Array.from({ length: BAR_COUNT }, (_, i) => {
  const center = (BAR_COUNT - 1) / 2;
  const envelope = Math.pow(1 - Math.abs(i - center) / center, 1.5);
  const jitter = 0.3 + (((i * 41 + 7) % 76) / 76) * 0.7;
  return {
    id: `wb-${i}`,
    dur: (0.65 + ((i * 1.618) % 1.5)).toFixed(2),
    delay: (-((i * 0.31) % 2.4)).toFixed(2),
    maxH: 100 + envelope * jitter * 304,
  };
});

// Placeholder community feed — wire to /api/scans/recent later
const COMMUNITY = [
  { id: "1", title: "Something in the Way",     artist: "Nirvana",              genre: "Grunge",       user: "mkumar",   time: "2m ago",  bg: "linear-gradient(135deg,#1a0a08,#3d180a)" },
  { id: "2", title: "Blinding Lights",           artist: "The Weeknd",           genre: "Synth-pop",    user: "ftorres",  time: "8m ago",  bg: "linear-gradient(135deg,#180a0a,#3d0808)" },
  { id: "3", title: "Take Five",                 artist: "Dave Brubeck Quartet", genre: "Jazz",         user: "jazz.pal", time: "14m ago", bg: "linear-gradient(135deg,#0a180a,#183d0a)" },
  { id: "4", title: "Bohemian Rhapsody",         artist: "Queen",                genre: "Rock",         user: "atrev",    time: "31m ago", bg: "linear-gradient(135deg,#1a1808,#3d3a0a)" },
  { id: "5", title: "Ultralight Beam",           artist: "Kanye West",           genre: "Gospel · Rap", user: "dnova",    time: "45m ago", bg: "linear-gradient(135deg,#180a18,#3d0a3d)" },
  { id: "6", title: "So What",                   artist: "Miles Davis",          genre: "Jazz",         user: "rlopez",   time: "1h ago",  bg: "linear-gradient(135deg,#0a1818,#0a3d3d)" },
  { id: "7", title: "Murder on the Dancefloor",  artist: "Sophie Ellis-Bextor",  genre: "Nu-disco",     user: "pria",     time: "1h ago",  bg: "linear-gradient(135deg,#0a0a18,#0a0a3d)" },
];

function BoltIcon({ className, style }: Readonly<{ className?: string; style?: React.CSSProperties }>) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 36" fill="currentColor" aria-hidden>
      <path d="M14 0L1 20h9L7 36l17-24h-9z" />
    </svg>
  );
}

function WaveformBars({ active }: Readonly<{ active: boolean }>) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden"
    >
      <div className="flex -translate-y-6 items-center gap-[3px] md:-translate-y-4">
        {BARS.map(({ id, dur, delay, maxH }) => (
          <div
            key={id}
            className="w-[2.5px] shrink-0 rounded-full"
            style={{
              height: `${maxH}px`,
              background: active ? `oklch(62% 0.2 28 / 0.55)` : `oklch(62% 0.2 28 / 0.18)`,
              animation: `waveBar ${dur}s ${delay}s ease-in-out infinite`,
              transition: "background 0.9s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function ScanRings() {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ border: "1.5px solid oklch(62% 0.2 28 / 0.7)" }}
          animate={{ width: ["188px", "400px"], height: ["188px", "400px"], opacity: [0.7, 0] }}
          transition={{ duration: 0.7, delay: i * 0.65, repeat: Infinity, ease: "easeOut" }}
        />
      ))}
    </>
  );
}

function ResultContent({ state, track, errorMessage, onReset }: Readonly<{
  state: string;
  track: ScannedTrack | null;
  errorMessage: string | null;
  onReset: () => void;
}>) {
  return (
    <div className="dark" style={{ "--card": "240 8% 14%" } as React.CSSProperties}>
      {state === "success" && track ? (
        <TrackResult track={track} onScanAnother={onReset} />
      ) : state === "error" ? (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <AlertCircle className="size-10 text-white/35" />
          <p className="max-w-xs text-sm leading-relaxed text-white/50">{errorMessage}</p>
          <button onClick={onReset} className="rounded-full px-6 py-2 text-sm font-semibold text-white" style={{ background: CORAL }}>
            Try again
          </button>
        </div>
      ) : state === "no-match" ? (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <SearchX className="size-10 text-white/35" />
          <p className="max-w-xs text-sm leading-relaxed text-white/50">
            Couldn&apos;t identify that track. Try getting closer to the source.
          </p>
          <button onClick={onReset} className="rounded-full px-6 py-2 text-sm font-semibold text-white" style={{ background: CORAL }}>
            Scan again
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function ScanPage() {
  const { state, track, errorMessage, secondsLeft, startScan, reset } = useSongScan();
  const [recentScans, setRecentScans] = useState<ScannedTrack[]>([]);
  const autoStarted = useRef(false);

  // Auto-start when arriving from the home Scan button / "S" shortcut.
  useEffect(() => {
    if (autoStarted.current) return;
    if (new URLSearchParams(window.location.search).get("autostart") === "1") {
      autoStarted.current = true;
      startScan();
    }
  }, [startScan]);

  useEffect(() => {
    if (state === "success" && track) {
      setRecentScans((prev) => [track, ...prev.filter((t) => t.id !== track.id)].slice(0, 5));
    }
  }, [state, track]);

  const isActive = state === "recording" || state === "identifying" || state === "requesting-permission";
  const hasResult = state === "success" || state === "error" || state === "no-match";

  // ── Shared background decorations ───────────────────────────────
  const bgDecorations = (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.045]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "300px 300px",
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center">
        <div
          className="rounded-full blur-[130px]"
          style={{
            width: isActive ? 380 : 230,
            height: isActive ? 380 : 230,
            background: "oklch(62% 0.2 28 / 0.1)",
            transition: "width 1s ease, height 1s ease",
          }}
        />
      </div>
    </>
  );

  // ── The scan button ──────────────────────────────────────────────
  const scanButton = (
    <div className="relative z-10 flex flex-col items-center gap-5">
      <div className="relative flex items-center justify-center">
        {isActive && <ScanRings />}
        {state === "idle" && (
          <motion.div
            className="absolute rounded-full"
            style={{ border: "1.5px solid oklch(62% 0.2 28 / 0.28)" }}
            animate={{ width: ["198px", "234px"], height: ["198px", "234px"], opacity: [0.5, 0.03] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <motion.button
          onClick={startScan}
          disabled={isActive}
          whileTap={!isActive ? { scale: 0.96 } : {}}
          className="relative z-10 flex size-[156px] cursor-pointer items-center justify-center rounded-full disabled:cursor-default md:size-[188px]"
          style={{
            background: isActive
              ? "radial-gradient(circle at 40% 40%, oklch(62% 0.2 28 / 0.22), oklch(62% 0.2 28 / 0.06))"
              : "radial-gradient(circle at 40% 40%, oklch(62% 0.2 28 / 0.14), oklch(62% 0.2 28 / 0.04))",
            border: `1.5px solid oklch(62% 0.2 28 / ${isActive ? "0.88" : "0.45"})`,
            boxShadow: isActive
              ? "0 0 80px oklch(62% 0.2 28 / 0.38), inset 0 0 40px oklch(62% 0.2 28 / 0.08)"
              : "0 0 48px oklch(62% 0.2 28 / 0.14), inset 0 0 32px oklch(62% 0.2 28 / 0.06)",
            transition: "all 0.3s ease",
          }}
          aria-label="Tap to scan a song"
        >
          {state === "identifying" ? (
            <Loader2 className="size-10 animate-spin md:size-12" style={{ color: CORAL }} />
          ) : (
            <BoltIcon className="size-11 md:size-11" style={{ color: "white" }} />
          )}
        </motion.button>
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={state}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.18 }}
          className="text-[12px] font-medium uppercase tracking-[0.18em] text-white/40"
        >
          {state === "idle" && "Tap to identify"}
          {state === "requesting-permission" && "Requesting mic…"}
          {state === "recording" && `Listening… ${secondsLeft}s`}
          {state === "identifying" && "Identifying…"}
          {state === "success" && "Found it"}
          {state === "no-match" && "No match"}
          {state === "error" && "Something went wrong"}
        </motion.p>
      </AnimatePresence>
    </div>
  );

  return (
    <div className="dark relative flex h-[calc(100dvh-58px-64px)] w-full flex-col overflow-hidden bg-[#0a0a0a] sm:h-[calc(100dvh-58px)]">

      {/* ══ BODY ════════════════════════════════════════════════════ */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Scanner column ─────────────────────────────────────── */}
        <div className="relative flex flex-1 flex-col overflow-hidden md:flex-none md:w-[45%] md:border-r md:border-white/[0.07]">
          {bgDecorations}
          <WaveformBars active={isActive} />

          {/* Centered scan button */}
          <div className="relative z-10 flex flex-1 items-center justify-center">
            {scanButton}
          </div>

          {/* ── Mobile: recently scanned strip ────────────────────── */}
          {recentScans.length > 0 && (
            <div className="relative z-10 w-full flex-shrink-0 px-5 pb-2 md:hidden">
              <p className="mb-2 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-white/28">Recently scanned</p>
              <div className="flex gap-3 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
                {recentScans.map((t, idx) => (
                  <div key={t.id ?? idx} className="flex w-14 flex-shrink-0 flex-col items-center gap-1.5">
                    {t.albumArtUrl ? (
                      <Image src={t.albumArtUrl} alt={t.title} width={56} height={56} className="size-14 rounded-lg border border-white/[0.07] object-cover" />
                    ) : (
                      <div className="flex size-14 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.04]">
                        <Music2 className="size-5 text-white/25" />
                      </div>
                    )}
                    <span className="w-full truncate text-center text-[9px] text-white/35">{t.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* ── Desktop: community feed ────────────────────────────── */}
        <div className="hidden flex-1 flex-col overflow-y-auto bg-[#0f0f0f] [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-white/[0.1] md:flex">
          <div className="flex flex-shrink-0 items-center justify-between border-b border-white/[0.07] px-6 py-5">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/28">Community scans</h2>
            <span className="flex items-center gap-1.5 text-[11px] font-medium" style={{ color: CORAL }}>
              <span className="inline-block size-1.5 animate-pulse rounded-full" style={{ background: CORAL }} />Live
            </span>
          </div>
          {COMMUNITY.map((item) => (
            <div key={item.id} className="flex flex-shrink-0 cursor-pointer items-center gap-3 border-b border-white/[0.05] px-6 py-3.5 transition-colors hover:bg-white/[0.025]">
              <div className="flex size-11 flex-shrink-0 items-center justify-center rounded-lg border border-white/[0.06]" style={{ background: item.bg }}>
                <Music2 className="size-4 text-white/35" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-medium text-white">{item.title}</p>
                <p className="mt-0.5 text-[12px] text-white/45">{item.artist}</p>
                <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-white/30">
                  <span>@{item.user}</span>
                  <span className="inline-block size-[3px] rounded-full bg-white/20" />
                  <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2 py-px text-[10px]">{item.genre}</span>
                </div>
              </div>
              <span className="flex-shrink-0 font-mono text-[10.5px] text-white/25">{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══ DESKTOP RESULT PANEL (slides from right) ═══════════════ */}
      <AnimatePresence>
        {hasResult && (
          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 270 }}
            className="dark fixed bottom-0 right-0 top-[58px] z-40 hidden w-[380px] flex-col border-l border-white/[0.1] bg-[rgba(10,10,10,0.97)] backdrop-blur-xl md:flex"
          >
            <div className="flex flex-shrink-0 items-center justify-between border-b border-white/[0.07] px-5 py-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">Match found</span>
              <button onClick={reset} className="flex size-[26px] items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.05] text-white/45 transition hover:bg-white/[0.09] hover:text-white" aria-label="Close">
                <X className="size-3.5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-white/[0.1]">
              <ResultContent state={state} track={track} errorMessage={errorMessage} onReset={reset} />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ══ MOBILE RESULT SHEET (slides up) ════════════════════════ */}
      <AnimatePresence>
        {hasResult && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/55 md:hidden" onClick={reset} />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="dark fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-[22px] border-t border-white/[0.1] bg-[#0b0b0b] md:hidden"
              style={{ maxHeight: "82vh" }}
            >
              <div className="mx-auto mt-3 h-1 w-8 flex-shrink-0 rounded-full bg-white/[0.18]" />
              <div className="flex flex-shrink-0 items-center justify-between px-5 py-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">Match found</span>
                <button onClick={reset} className="flex size-[26px] items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.05] text-white/45" aria-label="Close">
                  <X className="size-3.5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-4 pb-8 [&::-webkit-scrollbar]:hidden">
                <ResultContent state={state} track={track} errorMessage={errorMessage} onReset={reset} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
