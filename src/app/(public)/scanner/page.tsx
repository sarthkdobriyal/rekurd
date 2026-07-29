"use client";

import useSongScan from "@/hooks/useSongScan";
import useIsMobile from "@/hooks/useIsMobile";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Info, Loader2, Music2, SearchX, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import TrackResult from "@/app/(main)/scan/_components/TrackResult";
import LoginForm from "@/app/(auth)/login/LoginForm";
import SignUpForm from "@/app/(auth)/signup/SignUpForm";
import GoogleSignInButton from "@/app/(auth)/login/google/GoogleSignInButton";
import type { ScannedTrack } from "@/lib/types";

const CORAL = "oklch(62% 0.2 28)";

const BARS = Array.from({ length: 62 }, (_, i) => ({
  id: `wb-${i}`,
  dur: (0.65 + ((i * 1.618) % 1.5)).toFixed(2),
  delay: (-((i * 0.31) % 2.4)).toFixed(2),
  maxH: 8 + ((i * 41 + 7) % 76),
}));

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
      className="pointer-events-none absolute bottom-0 left-0 right-0 flex h-44 items-end justify-center gap-[2.5px] overflow-hidden px-2 pb-4"
    >
      {BARS.map(({ id, dur, delay, maxH }) => (
        <div
          key={id}
          className="w-[2.5px] shrink-0 rounded-full"
          style={{
            height: `${maxH}px`,
            transformOrigin: "bottom",
            background: active ? `oklch(62% 0.2 28 / 0.55)` : `oklch(62% 0.2 28 / 0.18)`,
            animation: `waveBar ${dur}s ${delay}s ease-in-out infinite`,
            transition: "background 0.7s ease",
          }}
        />
      ))}
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
          transition={{ duration: 2, delay: i * 0.65, repeat: Infinity, ease: "easeOut" }}
        />
      ))}
    </>
  );
}

function AuthContent() {
  return (
    <>
      <p className="mb-1 text-center font-superChargedLazer text-[22px] font-extralight italic tracking-widest text-white">
        outsound.
      </p>
      <p className="mb-5 text-center text-xs text-white/35">A place where you can find a tune.</p>
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-full bg-white/[0.07] p-1">
          <TabsTrigger
            value="login"
            className="rounded-full text-sm text-white/55 data-[state=active]:bg-[oklch(62%_0.2_28)] data-[state=active]:text-white"
          >
            Log In
          </TabsTrigger>
          <TabsTrigger
            value="signup"
            className="rounded-full text-sm text-white/55 data-[state=active]:bg-[oklch(62%_0.2_28)] data-[state=active]:text-white"
          >
            Sign Up
          </TabsTrigger>
        </TabsList>
        <TabsContent value="login" className="space-y-3 pt-4">
          <GoogleSignInButton />
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-white/[0.08]" />
            <span className="text-xs text-white/30">OR</span>
            <div className="h-px flex-1 bg-white/[0.08]" />
          </div>
          <LoginForm />
        </TabsContent>
        <TabsContent value="signup" className="space-y-3 pt-4">
          <GoogleSignInButton />
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-white/[0.08]" />
            <span className="text-xs text-white/30">OR</span>
            <div className="h-px flex-1 bg-white/[0.08]" />
          </div>
          <SignUpForm />
        </TabsContent>
      </Tabs>
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


export default function ScannerPage() {
  const { state, track, errorMessage, secondsLeft, startScan, reset } = useSongScan();
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [recentScans, setRecentScans] = useState<ScannedTrack[]>([]);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { if (state === "login-required") setLoginOpen(true); }, [state]);
  useEffect(() => {
    if (state === "success" && track) {
      setRecentScans((prev) => [track, ...prev.filter((t) => t.id !== track.id)].slice(0, 5));
    }
  }, [state, track]);

  const isActive = state === "recording" || state === "identifying" || state === "requesting-permission";
  const hasResult = state === "success" || state === "error" || state === "no-match";

  const handleLoginClose = (open: boolean) => {
    setLoginOpen(open);
    if (!open && state === "login-required") reset();
  };

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
            <BoltIcon className="size-9 md:size-11" style={{ color: CORAL }} />
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
          {state === "login-required" && "Log in to continue"}
        </motion.p>
      </AnimatePresence>
    </div>
  );

  return (
    <main className="dark relative flex h-screen w-screen flex-col overflow-hidden bg-[#0a0a0a]">

      {/* ══ DESKTOP NAV ════════════════════════════════════════════ */}
      <nav
        className="hidden md:flex flex-shrink-0 items-center justify-between px-7 backdrop-blur-md border-b border-white/[0.07] bg-[rgba(8,8,8,0.85)] z-30"
        style={{ height: 58 }}
      >
        <div className="flex items-center gap-2">
          <BoltIcon className="size-3" style={{ color: CORAL }} />
          <span className="font-superChargedLazer text-[18px] font-extralight italic tracking-widest text-white">outsound.</span>
        </div>
        <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1">
          {(["Scan", "Feed", "Radio", "Discover"] as const).map((label) => (
            <Link key={label} href={label === "Scan" ? "/scanner" : `/${label.toLowerCase()}`}
              className={`rounded-md px-4 py-2 text-[13px] font-medium transition-colors ${label === "Scan" ? "text-white" : "text-white/45 hover:text-white"}`}
            >{label}</Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setLoginOpen(true)}
            className="rounded-full border border-white/[0.16] px-4 py-1.5 text-[12.5px] font-medium text-white/65 transition hover:border-white/30 hover:text-white">
            Log in
          </button>
          <button onClick={() => setLoginOpen(true)}
            className="rounded-full px-4 py-1.5 text-[12.5px] font-semibold text-white transition hover:brightness-110"
            style={{ background: CORAL }}>
            Sign up free
          </button>
        </div>
      </nav>

      {/* ══ MOBILE HEADER ══════════════════════════════════════════ */}
      <header className="relative z-20 flex flex-shrink-0 items-center justify-between px-5 py-4 md:hidden">
        <div className="flex items-center gap-1.5">
          <BoltIcon className="size-3" style={{ color: CORAL }} />
          <span className="font-superChargedLazer text-[18px] font-extralight italic tracking-widest text-white">outsound.</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setLoginOpen(true)}
            className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-medium text-white/65 transition hover:border-white/40 hover:text-white">
            Log in
          </button>
          <Link href="/landing" aria-label="About outsound" className="flex size-8 items-center justify-center text-white/35 transition hover:text-white/75">
            <Info className="size-[17px]" />
          </Link>
        </div>
      </header>

      {/* ══ BODY ════════════════════════════════════════════════════ */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Scanner column ─────────────────────────────────────── */}
        <div className="relative flex flex-1 flex-col overflow-hidden md:flex-none md:w-[45%] md:border-r md:border-white/[0.07]">
          {bgDecorations}
          <WaveformBars active={isActive} />

          {/* Desktop info icon */}
          <Link href="/landing" aria-label="About outsound"
            className="absolute right-4 top-3 z-10 hidden size-[30px] items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.05] text-[12px] text-white/45 transition hover:bg-white/[0.09] hover:text-white md:flex">
            ⓘ
          </Link>

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

          {/* ── Mobile: bottom nav ────────────────────────────────── */}
          <nav className="relative z-10 flex w-full flex-shrink-0 border-t border-white/[0.07] bg-[rgba(8,8,8,0.92)] backdrop-blur-md md:hidden">
            {[
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>, label: "Feed",    href: "/" },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>, label: "Discover", href: "/discover" },
              { icon: <BoltIcon />,                                                                                                                                                                                     label: "Scan",     href: "/scanner", active: true },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>, label: "Radio", href: "/radio" },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, label: "Profile", href: "/users/me" },
            ].map(({ icon, label, href, active }) => (
              <Link key={label} href={href} className="flex flex-1 flex-col items-center gap-[3px] pb-5 pt-2">
                <span className="flex size-[22px] items-center justify-center" style={{ color: active ? CORAL : "rgba(255,255,255,0.38)" }}>{icon}</span>
                <span className="text-[10px] font-medium" style={{ color: active ? CORAL : "rgba(255,255,255,0.38)" }}>{label}</span>
              </Link>
            ))}
          </nav>
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

      {/* ══ LOGIN — DESKTOP DIALOG ══════════════════════════════════ */}
      {mounted && !isMobile && (
        <Dialog open={loginOpen} onOpenChange={handleLoginClose}>
          <DialogContent className="dark border-white/[0.08] bg-[#101010] sm:max-w-[420px]">
            <DialogTitle className="sr-only">Sign in to outsound</DialogTitle>
            <AuthContent />
          </DialogContent>
        </Dialog>
      )}

      {/* ══ LOGIN — MOBILE BOTTOM SHEET (slides up) ════════════════ */}
      <AnimatePresence>
        {mounted && isMobile && loginOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/65"
              onClick={() => handleLoginClose(false)} />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="dark fixed bottom-0 left-0 right-0 z-[60] rounded-t-[24px] border-t border-white/[0.1] bg-[#0d0d0d] px-5 pb-10"
            >
              <div className="mx-auto mb-5 mt-3 h-1 w-8 rounded-full bg-white/[0.18]" />
              <AuthContent />
              <p className="mt-4 text-center text-[10.5px] text-white/28">
                By continuing you agree to our{" "}
                <a href="#" className="underline">Terms</a> &amp;{" "}
                <a href="#" className="underline">Privacy Policy</a>
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}

  