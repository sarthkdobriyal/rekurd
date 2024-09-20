import { isAuthUserRadioModerator } from "@/app/(main)/radio/actions";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const user = await validateRequest();

  if (!user) return new Response("Unauthorized", { status: 401 });

  // Fetch the current playback state
  const currentPlaybackState = await prisma.radioPlaybackState.findFirst({
    include: {
      song: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatarUrl: true,
            },
          },
        },
      },
    },
  });

  // Fetch the last song in the queue
  const lastQueueEntry = await prisma.radioQueue.findFirst({
    orderBy: {
      position: "desc",
    },
    include: {
      song: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatarUrl: true,
            },
          },
        },
      },
    },
  });

return NextResponse.json({
    currentPlaybackState,
    lastQueueEntry,
});
}
