"use client";

import EmptyState from "@/components/EmptyState";
import useSongScan from "@/hooks/useSongScan";
import { AlertCircle, Loader2, Mic, SearchX } from "lucide-react";
import TrackResult from "./TrackResult";

export default function ScanButton() {
  const {
    state,
    track,
    errorMessage,
    secondsLeft,
    lastRecordingUrl,
    startScan,
    reset,
  } = useSongScan();

  // TEMP DEBUG: lets you confirm the mic actually captured audio.
  const debugPlayback = lastRecordingUrl && (
    <div className="rounded-lg border border-dashed p-3 text-center">
      <p className="mb-2 text-xs text-muted-foreground">
        Debug: last recording captured
      </p>
      <audio controls src={lastRecordingUrl} className="mx-auto w-full max-w-xs" />
    </div>
  );

  if (state === "error") {
    return (
      <div className="space-y-3">
        <EmptyState
          icon={AlertCircle}
          title="Something went wrong"
          description={errorMessage ?? undefined}
          action={{ label: "Try again", onClick: reset }}
        />
        {debugPlayback}
      </div>
    );
  }

  if (state === "no-match") {
    return (
      <div className="space-y-3">
        <EmptyState
          icon={SearchX}
          title="No match found"
          description="We couldn't identify that track. Try getting closer to the source and reduce background noise."
          action={{ label: "Scan again", onClick: reset }}
        />
        {debugPlayback}
      </div>
    );
  }

  if (state === "success" && track) {
    return <TrackResult track={track} onScanAnother={reset} />;
  }

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl bg-card p-10 shadow-sm">
      <button
        onClick={startScan}
        disabled={state === "requesting-permission" || state === "recording" || state === "identifying"}
        className="flex size-24 items-center justify-center rounded-full bg-primary text-primary-foreground transition disabled:opacity-70"
      >
        {state === "recording" || state === "identifying" ? (
          <Loader2 className="size-10 animate-spin" />
        ) : (
          <Mic className="size-10" />
        )}
      </button>

      <p className="text-sm text-muted-foreground">
        {state === "idle" && "Tap to scan a song"}
        {state === "requesting-permission" && "Requesting microphone access..."}
        {state === "recording" && `Listening... ${secondsLeft}s`}
        {state === "identifying" && "Identifying track..."}
      </p>
    </div>
  );
}
