import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


function getPagination(page: number, size: number) {
    const limit = size ? +size : 10;
    const from = page ? page * limit : 0;
    const to = page ? from + limit - 1 : limit - 1;
  
    return { from, to };
  }

export async function GET(req: Request) {
    try {
        const {user} = await validateRequest();
        const { searchParams } = new URL(req.url);
        const chatId = searchParams.get('chatId');
    
        if (!user) {
          return new Response('Unauthorized', { status: 401 });
        }
    
        if (!chatId) {
          return new Response('Bad Request', { status: 400 });
        }
    
        const page = Number(searchParams.get('page'));
        const size = Number(searchParams.get('size'));
    
        const { from, to } = getPagination(page, size);
    
        const messages = await prisma.message.findMany({
            where: {
              conversationId: chatId,
            },
            include: {
              sender: true, // Include the related User model
            },
            skip: from,
            take: to - from + 1,
            orderBy: {
              createdAt: 'desc',
            },
          });
          
          console.log(messages.length)
    
        return NextResponse.json({messages});
      } catch (error) {
        console.log('SERVER ERROR: ', error);
        return new Response('Internal Server Error', { status: 500 });
      }
    }
export async function POST(req: Request) {
}