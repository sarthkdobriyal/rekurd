import crypto from "crypto";

interface AcrCloudTrack {
  acrId: string;
  isrc: string | null;
  title: string;
  artist: string;
  album: string | null;
  genres: string[];
  releaseDate: string | null;
  label: string | null;
  durationMs: number | null;
  spotifyTrackId: string | null;
  youtubeVideoId: string | null;
  composers: string[];
}

type AcrCloudResult =
  | { matched: true; track: AcrCloudTrack }
  | { matched: false; reason: "no_match" | "error" };

const REQUIRED_ENV = [
  "ACRCLOUD_HOST",
  "ACRCLOUD_ACCESS_KEY",
  "ACRCLOUD_ACCESS_SECRET",
] as const;

function getConfig() {
  for (const key of REQUIRED_ENV) {
    if (!process.env[key]) {
      throw new Error(`Missing required env var: ${key}`);
    }
  }
  return {
    host: process.env.ACRCLOUD_HOST!,
    accessKey: process.env.ACRCLOUD_ACCESS_KEY!,
    accessSecret: process.env.ACRCLOUD_ACCESS_SECRET!,
  };
}

function buildSignature(
  accessSecret: string,
  accessKey: string,
  dataType: string,
  signatureVersion: string,
  timestamp: number,
) {
  const stringToSign = [
    "POST",
    "/v1/identify",
    accessKey,
    dataType,
    signatureVersion,
    timestamp,
  ].join("\n");

  return crypto
    .createHmac("sha1", accessSecret)
    .update(stringToSign)
    .digest("base64");
}

export async function identifyTrack(
  audio: Blob,
): Promise<AcrCloudResult> {
  const { host, accessKey, accessSecret } = getConfig();

  const dataType = "audio";
  const signatureVersion = "1";
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = buildSignature(
    accessSecret,
    accessKey,
    dataType,
    signatureVersion,
    timestamp,
  );

  const sampleBytes = audio.size;

  const form = new FormData();
  form.append("sample", audio, "sample");
  form.append("sample_bytes", String(sampleBytes));
  form.append("access_key", accessKey);
  form.append("data_type", dataType);
  form.append("signature_version", signatureVersion);
  form.append("signature", signature);
  form.append("timestamp", String(timestamp));

  try {
    const res = await fetch(`https://${host}/v1/identify`, {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(10_000),
    });

    const data = await res.json();

    const code = data?.status?.code;

    // TEMP DEBUG: log the full raw response so we can see exactly what
    // ACRCloud returned (status code + message) while getting scans working.
    console.log("ACRCloud raw response:", res.status, JSON.stringify(data));

    // 0 = success/match. 1001 = no result found. Anything else is a real error.
    if (code === 1001) {
      return { matched: false, reason: "no_match" };
    }

    if (code !== 0) {
      console.error("ACRCloud identify error:", data?.status);
      return { matched: false, reason: "error" };
    }

    const music = data?.metadata?.music?.[0];

    if (!music) {
      return { matched: false, reason: "no_match" };
    }

    const artist =
      music.artists?.map((a: { name: string }) => a.name).join(", ") ??
      "Unknown Artist";

    const track: AcrCloudTrack = {
      acrId: music.acrid,
      isrc: music.external_ids?.isrc ?? null,
      title: music.title,
      artist,
      album: music.album?.name ?? null,
      genres: music.genres?.map((g: { name: string }) => g.name) ?? [],
      releaseDate: music.release_date || null,
      label: music.label || null,
      // duration_ms can be a number or a numeric string depending on the endpoint
      durationMs: music.duration_ms != null ? Number(music.duration_ms) : null,
      spotifyTrackId: music.external_metadata?.spotify?.track?.id ?? null,
      youtubeVideoId: music.external_metadata?.youtube?.vid ?? null,
      composers: (music.contributors?.composers as string[] | undefined) ?? [],
    };

    return { matched: true, track };
  } catch (error) {
    console.error("ACRCloud identify request failed:", error);
    return { matched: false, reason: "error" };
  }
}
