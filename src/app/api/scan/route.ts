import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { identifyTrack } from "@/lib/acrcloud";
import { enrichFromMusicBrainz } from "@/lib/musicbrainz";
import { enrichFromLastFm } from "@/lib/lastfm";
import { scanAudioSchema } from "@/lib/validation";

/** Fetch album art from Apple's iTunes Search API (no key required). */
async function fetchAlbumArtUrl(
  artist: string,
  title: string,
): Promise<string | null> {
  try {
    const term = encodeURIComponent(`${artist} ${title}`);
    const res = await fetch(
      `https://itunes.apple.com/search?term=${term}&entity=song&limit=1`,
      { signal: AbortSignal.timeout(5_000) },
    );
    if (!res.ok) return null;
    const data = await res.json();
    const raw: string | undefined = data?.results?.[0]?.artworkUrl100;
    if (!raw) return null;
    // Upgrade to 600 × 600 for reasonable quality
    return raw.replace("100x100bb", "600x600bb");
  } catch {
    return null;
  }
}

const SCAN_COOLDOWN_MS = 3_000;
const DEFAULT_DAILY_LIMIT = 30;
const DEFAULT_GUEST_SCAN_LIMIT = 3;
const GUEST_ID_COOKIE = "scan_guest_id";

function getGuestScanLimit() {
  const parsed = Number(process.env.GUEST_SCAN_LIMIT);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : DEFAULT_GUEST_SCAN_LIMIT;
}

// Auth check: logged-in users get a daily cap; anonymous visitors get a
// lifetime cap of GUEST_SCAN_LIMIT tracked via a signed httpOnly cookie
// (login_required once exhausted, never resets short of clearing cookies)
// Rate limit: 3s cooldown + daily cap (SCAN_DAILY_LIMIT env var, defaults to 30/day) for logged-in users
// Parses the audio blob from FormData, validates type/size via the new scanAudioSchema before touching any paid API
// Calls ACRCloud; both a real "no match" (200) and a service error (502) are logged as a Scan and count against the user's/guest's limit
// On match: checks the Track cache by acrId/isrc first; only calls MusicBrainz + Last.fm in parallel on a genuine cache miss, using upsert to avoid a race if two people scan a brand-new song simultaneously
// Logs a Scan row either way, returns the track JSON



function getDailyLimit() {
  const parsed = Number(process.env.SCAN_DAILY_LIMIT);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_DAILY_LIMIT;
}

export async function POST(req: Request) {
  try {
    const { user } = await validateRequest();
    const cookieStore = await cookies();
    let guestId: string | null = null;

    if (user) {
      const cooldownCutoff = new Date(Date.now() - SCAN_COOLDOWN_MS);
      const recentScan = await prisma.scan.findFirst({
        where: { userId: user.id, createdAt: { gte: cooldownCutoff } },
      });

      if (recentScan) {
        return Response.json(
          { error: "Please wait a moment before scanning again." },
          { status: 429 },
        );
      }

      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const todayCount = await prisma.scan.count({
        where: { userId: user.id, createdAt: { gte: startOfDay } },
      });

      if (todayCount >= getDailyLimit()) {
        return Response.json(
          { error: "Daily scan limit reached. Try again tomorrow." },
          { status: 429 },
        );
      }
    } else {
      guestId = cookieStore.get(GUEST_ID_COOKIE)?.value ?? null;

      const guestScanCount = guestId
        ? await prisma.scan.count({ where: { guestId } })
        : 0;

      if (guestScanCount >= getGuestScanLimit()) {
        return Response.json(
          {
            error: "Free scan limit reached. Log in to keep scanning.",
            reason: "login_required",
          },
          { status: 403 },
        );
      }

      if (!guestId) {
        guestId = randomUUID();
        cookieStore.set(GUEST_ID_COOKIE, guestId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 365,
        });
      }
    }

    const form = await req.formData();
    const audio = form.get("audio");

    if (!(audio instanceof Blob) || audio.size === 0) {
      return Response.json({ error: "No audio provided" }, { status: 400 });
    }

    // Browsers report MediaRecorder mime types with a codec parameter
    // (e.g. "audio/webm;codecs=opus") — validate against the base type.
    const baseType = audio.type.split(";")[0].trim();

    const validation = scanAudioSchema.safeParse({
      type: baseType,
      size: audio.size,
    });

    if (!validation.success) {
      return Response.json(
        { error: validation.error.issues[0]?.message ?? "Invalid audio" },
        { status: 400 },
      );
    }

    const acrResult = await identifyTrack(audio);

    if (!acrResult.matched) {
      await prisma.scan.create({
        data: { userId: user?.id ?? null, guestId, matched: false },
      });

      if (acrResult.reason === "error") {
        return Response.json(
          {
            matched: false,
            reason: "error",
            error: "Recognition service is unavailable. Please try again.",
          },
          { status: 502 },
        );
      }

      return Response.json({ matched: false, reason: "no_match" });
    }

    const { track: acrTrack } = acrResult;

    let track = await prisma.track.findUnique({
      where: { acrId: acrTrack.acrId },
    });

    if (!track && acrTrack.isrc) {
      track = await prisma.track.findUnique({
        where: { isrc: acrTrack.isrc },
      });
    }

    if (!track) {
      const [mbEnrichment, lastFmEnrichment, albumArtUrl] = await Promise.all([
        enrichFromMusicBrainz({
          isrc: acrTrack.isrc,
          title: acrTrack.title,
          artist: acrTrack.artist,
        }),
        enrichFromLastFm(acrTrack.artist),
        fetchAlbumArtUrl(acrTrack.artist, acrTrack.title),
      ]);

      track = await prisma.track.upsert({
        where: { acrId: acrTrack.acrId },
        update: {},
        create: {
          acrId: acrTrack.acrId,
          isrc: acrTrack.isrc,
          title: acrTrack.title,
          artist: acrTrack.artist,
          albumArtUrl,
          genre: mbEnrichment.genre ?? acrTrack.genres[0] ?? null,
          subgenre: mbEnrichment.subgenre ?? acrTrack.genres[1] ?? null,
          artistBio: lastFmEnrichment.bio,
          relatedArtists: lastFmEnrichment.relatedArtists,
          discography: mbEnrichment.discography,
        },
      });
    }

    await prisma.scan.create({
      data: { userId: user?.id ?? null, guestId, trackId: track.id, matched: true },
    });

    return Response.json({
      matched: true,
      track: {
        ...track,
        relatedArtists: Array.isArray(track.relatedArtists)
          ? track.relatedArtists
          : [],
        discography: Array.isArray(track.discography)
          ? track.discography
          : [],
        // ACRCloud-sourced fields — always fresh from the current scan
        album: acrTrack.album,
        releaseDate: acrTrack.releaseDate,
        label: acrTrack.label,
        durationMs: acrTrack.durationMs,
        spotifyTrackId: acrTrack.spotifyTrackId,
        youtubeVideoId: acrTrack.youtubeVideoId,
        composers: acrTrack.composers,
      },
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
