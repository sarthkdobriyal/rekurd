import { isAuthUserRadioModerator } from "@/app/(main)/radio/actions";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    const user = await isAuthUserRadioModerator();

    if(!user) return new Response('Unauthorized', { status: 401 });

    
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
        orderBy: {
            startedAt: 'desc',
        },
    });



    return Response.json(currentPlaybackState, {
        status: 200,
    })
}