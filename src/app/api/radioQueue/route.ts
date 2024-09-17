import { isAuthUserRadioModerator } from "@/app/(main)/radio/actions";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
      const user = await isAuthUserRadioModerator();
  
      if (!user) {
        return new Response('Unauthorized', { status: 401 });
      }
  
      const currentQueue = await prisma.radioQueue.findMany({
        orderBy: {
          position: 'asc', // Order by position to get the correct order in the queue
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
          }, // Include the song details
        },
      });
  
      return NextResponse.json(currentQueue);
    } catch (error) {
      console.log('SERVER ERROR: ', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }