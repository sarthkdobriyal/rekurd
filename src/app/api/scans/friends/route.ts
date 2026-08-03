import { NextRequest } from "next/server";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { formatRelativeDate } from "@/lib/utils";
import {
  spotifySearchUrl,
  youtubeSearchUrl,
  type ScanFeedPage,
} from "@/app/(main)/_components/dashboard/mock-data";

const PAGE_SIZE = 10;

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // JAM connections are directional rows but symmetric once CONNECTED —
    // gather the "other" user id from both sides.
    const connections = await prisma.connection.findMany({
      where: {
        status: "CONNECTED",
        OR: [{ requesterId: user.id }, { recipientId: user.id }],
      },
      select: { requesterId: true, recipientId: true },
    });

    const friendIds = connections.map((c) =>
      c.requesterId === user.id ? c.recipientId : c.requesterId,
    );

    if (friendIds.length === 0) {
      return Response.json({ scans: [], nextCursor: null } satisfies ScanFeedPage);
    }

    const scans = await prisma.scan.findMany({
      where: {
        userId: { in: friendIds },
        matched: true,
        trackId: { not: null },
      },
      include: {
        track: true,
        user: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor = scans.length > PAGE_SIZE ? scans[PAGE_SIZE].id : null;

    const data: ScanFeedPage = {
      scans: scans.slice(0, PAGE_SIZE).flatMap((scan) => {
        // trackId/user are guaranteed by the where clause, but narrow for TS.
        if (!scan.track || !scan.user) return [];
        const { track } = scan;
        return [
          {
            id: scan.id,
            user: {
              name: scan.user.displayName,
              username: scan.user.username,
              avatarUrl: scan.user.avatarUrl ?? undefined,
            },
            timeAgo: formatRelativeDate(scan.createdAt),
            track: {
              title: track.title,
              artist: track.artist,
              tags: [track.genre, track.subgenre].filter(
                (t): t is string => !!t,
              ),
              artUrl: track.albumArtUrl ?? undefined,
            },
            spotifyUrl: spotifySearchUrl(track.artist, track.title),
            youtubeUrl: youtubeSearchUrl(track.artist, track.title),
          },
        ];
      }),
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
