"use server"
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export type ConnectedUser = {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
}

export async function getConnectedUsers(userId: string): Promise<ConnectedUser[]> {
    const connections = await prisma.connection.findMany({
      where: {
        OR: [
          { recipientId: userId },
          { requesterId: userId }
        ]
      },
      select: {
        requester: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true
          }
        },
        recipient: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true
          }
        }
      }
    });
  
    // Extract and combine users
    const mixedconnectedUsers = connections.reduce((acc: ConnectedUser[], connection) => {
        acc.push(connection.requester as ConnectedUser, connection.recipient as ConnectedUser);
        return acc;
      }, [] as ConnectedUser[]);
  
    // Remove duplicates and exclude the current logged-in user
    const connectedUsers: ConnectedUser[] = Array.from(
      new Set(mixedconnectedUsers.map(user => user.id))
    )
    .map(id => mixedconnectedUsers.find(user => user.id === id)!)
    .filter(user => user.id !== userId);
  
    return connectedUsers;
  }

  export async function createChat(userId: string) {

    const { user: loggedInUser}  = await validateRequest()

    if(!loggedInUser) return null;

    const existingConversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          {
            users: {
              some: {
                id: loggedInUser.id,
              },
            },
          },
          {
            users: {
              some: {
                id: userId,
              },
            },
          },
        ],
      },
    });
  
    if (existingConversation) {
      revalidatePath(`/chats/${existingConversation.id}`)
      return redirect(`/chats/${existingConversation.id}`)
    }else{
      const newConversation = await prisma.conversation.create({
        data: {
          users: {
            connect: [
              {
                id: loggedInUser.id,
              },
              {
                id: userId,
              },
            ],
          },
        },
      });
  
      revalidatePath(`/chats/${newConversation.id}`)
      return redirect(`/chats/${newConversation.id}`)
    }
  }

  export async function sendMessage( chatId: string, content: string) {
    const { user: loggedInUser } = await validateRequest();
  
    if (!loggedInUser) return null;

    if(content === '') return null
  
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: chatId,
      },
      select: {
        users: {
          select: {
            id: true,
          },
        },
      },
    });
  
    if (!conversation) return new Error("Conversation not found");
  
    const isUserInConversation = conversation.users.some(
      (user) => user.id === loggedInUser.id,
    );
  
    if (!isUserInConversation) return new Error("User not in conversation");
  
    const message = await prisma.message.create({
      data: {
        content,
        senderId: loggedInUser.id,
        conversationId: chatId,
      },
    });

    
  
    revalidatePath(`/chats/${chatId}`)
  }
