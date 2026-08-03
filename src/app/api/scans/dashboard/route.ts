import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import type { RailItemData } from "@/app/(main)/_components/dashboard/mock-data";

// Fallback tile styling for tracks with no album art.
const FALLBACK_GRADIENT = "linear-gradient(135deg,#181818,#0a0a0a)";
const FALLBACK_EMOJI = "🎵";

export interface DashboardRailsResponse {
  recent: RailItemData[];
  trending: RailItemData[];
}

export async function GET() {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // "Recently scanned by you" — most recent unique tracks this user matched.
    const recentScans = await prisma.scan.findMany({
      where: { userId: user.id, matched: true, trackId: { not: null } },
      include: { track: true },
      orderBy: { createdAt: "desc" },
      distinct: ["trackId"],
      take: 6,
    });

    const recent: RailItemData[] = recentScans
      .filter((s) => s.track)
      .map((s) => ({
        id: s.id,
        title: s.track!.title,
        subtitle: s.track!.artist,
        artUrl: s.track!.albumArtUrl ?? undefined,
        artGradient: FALLBACK_GRADIENT,
        emoji: FALLBACK_EMOJI,
      }));

    // "Trending scans" — most-scanned tracks across all users in the last 7 days.
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const grouped = await prisma.scan.groupBy({
      by: ["trackId"],
      where: { matched: true, trackId: { not: null }, createdAt: { gte: since } },
      _count: { trackId: true },
      orderBy: { _count: { trackId: "desc" } },
      take: 5,
    });

    const trackIds = grouped
      .map((g) => g.trackId)
      .filter((id): id is string => id !== null);

    const tracks = await prisma.track.findMany({
      where: { id: { in: trackIds } },
    });
    const trackById = new Map(tracks.map((t) => [t.id, t]));

    const trending = grouped
      .map((g, i) => {
        const track = g.trackId ? trackById.get(g.trackId) : undefined;
        if (!track) return null;
        return {
          id: track.id,
          rank: i + 1,
          title: track.title,
          subtitle: track.artist,
          artUrl: track.albumArtUrl ?? undefined,
          artGradient: FALLBACK_GRADIENT,
          emoji: FALLBACK_EMOJI,
          trend: String(g._count.trackId),
        } satisfies RailItemData;
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    return Response.json({ recent, trending } satisfies DashboardRailsResponse);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
