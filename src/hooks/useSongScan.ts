import { useToast } from "@/components/ui/use-toast";
import kyInstance from "@/lib/ky";
import { ScannedTrack, ScanResponse } from "@/lib/types";
import { HTTPError } from "ky";
import { useCallback, useRef, useState } from "react";

const RECORDING_DURATION_MS = 10_000;

const PREFERRED_MIME_TYPES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/mp4",
];

type ScanState =
  | "idle"
  | "requesting-permission"
  | "recording"
  | "identifying"
  | "success"
  | "no-match"
  | "error"
  | "login-required";

function pickSupportedMimeType(): string | undefined {
  if (typeof MediaRecorder === "undefined") return undefined;

  return PREFERRED_MIME_TYPES.find((type) =>
    MediaRecorder.isTypeSupported(type),
  );
}

export default function useSongScan() {
  const { toast } = useToast();

  const [state, setState] = useState<ScanState>("idle");
  const [track, setTrack] = useState<ScannedTrack | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  // TEMP DEBUG: lets you play back exactly what the mic captured.
  const [lastRecordingUrl, setLastRecordingUrl] = useState<string | null>(
    null,
  );

  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const cleanupStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    mediaRecorderRef.current = null;
  }, []);

  const identify = useCallback(
    async (blob: Blob) => {
      setState("identifying");

      const formData = new FormData();
      formData.append("audio", blob, "sample");

      try {
        const response = await kyInstance
          .post("/api/scan", { body: formData, timeout: 20_000 })
          .json<ScanResponse>();

        if (response.matched) {
          setTrack(response.track);
          setState("success");
        } else {
          setState("no-match");
        }
      } catch (error) {
        let message = "Something went wrong. Please try again.";
        let loginRequired = false;

        if (error instanceof HTTPError) {
          try {
            const body = await error.response.json();
            if (body?.error) message = body.error;
            if (body?.reason === "login_required") loginRequired = true;
          } catch {
            // response wasn't JSON — fall back to the generic message
          }
        }

        if (loginRequired) {
          setState("login-required");
          return;
        }

        setErrorMessage(message);
        setState("error");
        toast({ variant: "destructive", description: message });
      }
    },
    [toast],
  );

  const startScan = useCallback(async () => {
    setTrack(null);
    setErrorMessage(null);
    setState("requesting-permission");

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setErrorMessage(
        "Microphone access was denied. Please allow microphone access to scan a song.",
      );
      setState("error");
      return;
    }

    streamRef.current = stream;

    const mimeType = pickSupportedMimeType();
    const recorder = new MediaRecorder(
      stream,
      mimeType ? { mimeType } : undefined,
    );
    mediaRecorderRef.current = recorder;

    const chunks: BlobPart[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const recordedType = recorder.mimeType || "audio/webm";
      cleanupStream();
      const blob = new Blob(chunks, { type: recordedType });
      // TEMP DEBUG
      console.log("Recorded blob size/type:", blob.size, blob.type);
      setLastRecordingUrl(URL.createObjectURL(blob));
      identify(blob);
    };

    setState("recording");
    recorder.start();

    const durationSeconds = RECORDING_DURATION_MS / 1000;
    setSecondsLeft(durationSeconds);

    const countdown = setInterval(() => {
      setSecondsLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    setTimeout(() => {
      clearInterval(countdown);
      if (recorder.state !== "inactive") recorder.stop();
    }, RECORDING_DURATION_MS);
  }, [cleanupStream, identify]);

  const reset = useCallback(() => {
    cleanupStream();
    setState("idle");
    setTrack(null);
    setErrorMessage(null);
    setSecondsLeft(0);
  }, [cleanupStream]);

  return {
    state,
    track,
    errorMessage,
    secondsLeft,
    lastRecordingUrl,
    startScan,
    reset,
  };
}
