import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { MessagePage, RadioMessagePage } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req: NextRequest) {
    try {

      const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
      const pageSize = 15;

        const {user} = await validateRequest();
       
        // const chatId = req.nextUrl.searchParams.get('chatId');
    
        if (!user) {
          return new Response('Unauthorized', { status: 401 });
        }
    


    
        const messages = await prisma.radioChatMessage.findMany({
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  avatarUrl: true,
                },
              }, // Include the related User model
            },
            cursor: cursor ? { id: cursor } : undefined,
            take: pageSize + 1,
            orderBy: {
              createdAt: 'desc',
            },
          });
          const nextCursor = messages.length > pageSize ? messages[pageSize].id : null;
          const data: RadioMessagePage = {
            messages: messages.slice(0, pageSize),
            nextCursor,
          };

        return NextResponse.json(data);
      } catch (error) {
        console.log('SERVER ERROR: ', error);
        return new Response('Internal Server Error', { status: 500 });
      }
    }
export async function POST(req: Request) {
}