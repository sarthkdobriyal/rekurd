"use client";

import useSongScan from "@/hooks/useSongScan";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Info, Loader2, Mic, SearchX } from "lucide-react";
import Link from "next/link";
import TrackResult from "@/app/(main)/scan/_components/TrackResult";
import LoginForm from "@/app/(auth)/login/LoginForm";
import SignUpForm from "@/app/(auth)/signup/SignUpForm";
import GoogleSignInButton from "@/app/(auth)/login/google/GoogleSignInButton";
import type { ScannedTrack } from "@/lib/types";

const CORAL = "oklch(62% 0.2 28)";

// Pre-computed bar configs so the array is stable across renders
const BARS = Array.from({ length: 52 }, (_, i) => ({
  id: `waveform-bar-${i}`,
  dur: (0.7 + ((i * 1.618) % 1.4)).toFixed(2),
  delay: (-((i * 0.31) % 2.2)).toFixed(2),
  maxH: 10 + ((i * 41 + 7) % 70),
}));

function WaveformBars({ active }: Readonly<{ active: boolean }>) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute bottom-0 left-0 right-0 flex h-44 items-end justify-center gap-[2.5px] overflow-hidden px-2 pb-4"
    >
      {BARS.map(({ id, dur, delay, maxH }) => (
        <div
          key={id}
          className="shrink-0 w-[3px] rounded-full"
          style={{
            height: `${maxH}px`,
            transformOrigin: "bottom",
            background: active
              ? `oklch(62% 0.2 28 / 0.55)`
              : `oklch(62% 0.2 28 / 0.2)`,
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
          style={{ border: `1.5px solid oklch(62% 0.2 28 / 0.55)` }}
          animate={{
            width: ["164px", "360px"],
            height: ["164px", "360px"],
            opacity: [0.75, 0],
          }}
          transition={{
            duration: 2.4,
            delay: i * 0.8,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </>
  );
}

function ScannerCenter({
  state,
  track,
  errorMessage,
  secondsLeft,
  onStart,
  onReset,
}: Readonly<{
  state: string;
  track: ScannedTrack | null;
  errorMessage: string | null;
  secondsLeft: number;
  onStart: () => void;
  onReset: () => void;
}>) {
  const isActive =
    state === "recording" ||
    state === "identifying" ||
    state === "requesting-permission";

  if (state === "success" && track) {
    return (
      <motion.div
        key="result"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-sm"
        style={{ '--card': '240 8% 14%' } as React.CSSProperties}
      >
        <TrackResult track={track} onScanAnother={onReset} />
      </motion.div>
    );
  }

  if (state === "error") {
    return (
      <motion.div
        key="error"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center gap-5 text-center"
      >
        <AlertCircle className="size-10 text-white/40" />
        <p className="max-w-xs text-sm leading-relaxed text-white/50">
          {errorMessage}
        </p>
        <button
          onClick={onReset}
          className="rounded-full px-6 py-2 text-sm font-medium text-white"
          style={{ background: CORAL }}
        >
          Try again
        </button>
      </motion.div>
    );
  }

  if (state === "login-required") {
    return (
      <motion.div
        key="login-required"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center gap-5 text-center"
      >
        <Mic className="size-10 text-white/40" />
        <p className="max-w-xs text-sm leading-relaxed text-white/50">
          You&apos;ve used your free scans. Log in to keep identifying songs.
        </p>
      </motion.div>
    );
  }

  if (state === "no-match") {
    return (
      <motion.div
        key="no-match"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center gap-5 text-center"
      >
        <SearchX className="size-10 text-white/40" />
        <p className="max-w-xs text-sm leading-relaxed text-white/50">
          Couldn&apos;t identify that track. Try getting closer to the source.
        </p>
        <button
          onClick={onReset}
          className="rounded-full px-6 py-2 text-sm font-medium text-white"
          style={{ background: CORAL }}
        >
          Scan again
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="scanner"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center gap-8"
    >
      <div className="relative flex items-center justify-center">
        {isActive && <ScanRings />}

        {state === "idle" && (
          <motion.div
            className="absolute rounded-full"
            style={{ border: `1.5px solid oklch(62% 0.2 28 / 0.3)` }}
            animate={{
              width: ["168px", "200px"],
              height: ["168px", "200px"],
              opacity: [0.55, 0.05],
            }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
          />
        )}

        <motion.button
          onClick={onStart}
          disabled={state !== "idle"}
          whileTap={state === "idle" ? { scale: 0.94 } : {}}
          className="relative z-10 flex size-40 cursor-pointer items-center justify-center rounded-full disabled:cursor-default md:size-52"
          style={{
            background: CORAL,
            boxShadow: isActive
              ? `0 0 90px oklch(62% 0.2 28 / 0.5), 0 0 35px oklch(62% 0.2 28 / 0.3)`
              : `0 0 45px oklch(62% 0.2 28 / 0.3)`,
            transition: "box-shadow 0.8s ease",
          }}
          aria-label="Tap to scan a song"
        >
          {state === "identifying" ? (
            <Loader2 className="size-14 animate-spin text-white md:size-16" />
          ) : (
            <Mic className="size-14 text-white md:size-16" strokeWidth={1.5} />
          )}
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={state}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="text-sm tracking-wide text-white/40"
        >
          {state === "idle" && "Tap to identify a song"}
          {state === "requesting-permission" && "Requesting microphone…"}
          {state === "recording" && `Listening… ${secondsLeft}s`}
          {state === "identifying" && "Identifying track…"}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
}

export default function ScannerPage() {
  const { state, track, errorMessage, secondsLeft, startScan, reset } =
    useSongScan();
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    if (state === "login-required") setLoginOpen(true);
  }, [state]);

  const isActive =
    state === "recording" ||
    state === "identifying" ||
    state === "requesting-permission";

  const isResultState =
    state === "success" ||
    state === "error" ||
    state === "no-match" ||
    state === "login-required";

  return (
    <main className="dark relative flex h-screen w-screen flex-col overflow-hidden bg-[#0a0a0a]" data-theme="dark">
      {/* SVG noise texture overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "300px 300px",
        }}
      />

      {/* Radial ambient glow behind the button */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center"
      >
        <div
          className="rounded-full blur-[130px]"
          style={{
            width: isActive ? 420 : 260,
            height: isActive ? 420 : 260,
            background: `oklch(62% 0.2 28 / 0.11)`,
            transition: "width 1s ease, height 1s ease",
          }}
        />
      </div>

      {/* Waveform visualizer */}
      <WaveformBars active={isActive} />

      {/* ─── Header ─────────────────────────────────────────── */}
      <header className="relative z-10 flex items-center justify-between px-5 py-4 md:px-8 md:py-5">
        <span className="font-superChargedLazer text-xl font-extralight italic tracking-widest text-white">
          outsound.
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLoginOpen(true)}
            className="rounded-full border border-white/20 px-5 py-1.5 text-sm text-white/75 backdrop-blur-sm transition hover:border-white/40 hover:text-white"
          >
            Log in
          </button>
          <Link
            href="/landing"
            aria-label="About outsound"
            className="flex size-9 items-center justify-center rounded-full text-white/35 transition hover:text-white/75"
          >
            <Info className="size-[18px]" />
          </Link>
        </div>
      </header>

      {/* ─── Center ─────────────────────────────────────────── */}
      <div
        className={`relative z-10 flex flex-1 flex-col items-center overflow-y-auto px-6 ${
          isResultState ? "justify-start pb-10 pt-6" : "justify-center pb-40"
        }`}
      >
        <AnimatePresence mode="wait">
          <ScannerCenter
            state={state}
            track={track}
            errorMessage={errorMessage}
            secondsLeft={secondsLeft}
            onStart={startScan}
            onReset={reset}
          />
        </AnimatePresence>
      </div>

      {/* ─── Login / Sign Up modal ───────────────────────────── */}
      <Dialog
        open={loginOpen}
        onOpenChange={(open) => {
          setLoginOpen(open);
          if (!open && state === "login-required") reset();
        }}
      >
        <DialogContent className="dark border-white/10 bg-[#111111] text-white sm:max-w-[420px]">
          <DialogTitle className="text-center font-superChargedLazer text-2xl font-extralight italic tracking-widest text-white">
            outsound.
          </DialogTitle>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/5">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white"
              >
                Log In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4 pt-5">
              <GoogleSignInButton />
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-white/30">OR</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>
              <LoginForm />
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 pt-5">
              <GoogleSignInButton />
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-white/30">OR</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>
              <SignUpForm />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </main>
  );
}
