import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { identifyTrack } from "@/lib/acrcloud";
import { enrichFromMusicBrainz } from "@/lib/musicbrainz";
import { enrichFromLastFm } from "@/lib/lastfm";
import { scanAudioSchema } from "@/lib/validation";

const SCAN_COOLDOWN_MS = 3_000;
const DEFAULT_DAILY_LIMIT = 30;


// Auth check (401 if not logged in)
// Rate limit: 3s cooldown + daily cap (SCAN_DAILY_LIMIT env var, defaults to 30/day)
// Parses the audio blob from FormData, validates type/size via the new scanAudioSchema before touching any paid API
// Calls ACRCloud; distinguishes a real "no match" (logged as a Scan, returned as a normal 200 response) from a service error (502, not counted against the user's scans)
// On match: checks the Track cache by acrId/isrc first; only calls MusicBrainz + Last.fm in parallel on a genuine cache miss, using upsert to avoid a race if two people scan a brand-new song simultaneously
// Logs a Scan row either way, returns the track JSON



function getDailyLimit() {
  const parsed = Number(process.env.SCAN_DAILY_LIMIT);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_DAILY_LIMIT;
}

export async function POST(req: Request) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

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

      await prisma.scan.create({
        data: { userId: user.id, matched: false },
      });

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
      const [mbEnrichment, lastFmEnrichment] = await Promise.all([
        enrichFromMusicBrainz({
          isrc: acrTrack.isrc,
          title: acrTrack.title,
          artist: acrTrack.artist,
        }),
        enrichFromLastFm(acrTrack.artist),
      ]);

      track = await prisma.track.upsert({
        where: { acrId: acrTrack.acrId },
        update: {},
        create: {
          acrId: acrTrack.acrId,
          isrc: acrTrack.isrc,
          title: acrTrack.title,
          artist: acrTrack.artist,
          genre: mbEnrichment.genre ?? acrTrack.genres[0] ?? null,
          subgenre: mbEnrichment.subgenre ?? acrTrack.genres[1] ?? null,
          artistBio: lastFmEnrichment.bio,
          relatedArtists: lastFmEnrichment.relatedArtists,
          discography: mbEnrichment.discography,
        },
      });
    }

    await prisma.scan.create({
      data: { userId: user.id, trackId: track.id, matched: true },
    });

    return Response.json({ matched: true, track });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
