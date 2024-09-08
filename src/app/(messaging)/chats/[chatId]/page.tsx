import { validateRequest } from "@/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UserAvatar from "@/components/UserAvatar";
import prisma from "@/lib/prisma";
import { ArrowBigLeft, ArrowLeft, MessageCircle, PhoneIcon, SendIcon, VideoIcon } from "lucide-react";
import Image from "next/image";
import { FC, Suspense } from "react";
import SendMessage from '../_components/SendMessage';
import { createChat } from "../actions";
import { Skeleton } from "@/components/ui/skeleton";
import Message from "../_components/Message";
import Conversation from "../_components/Conversation";
import Loading from "@/app/(main)/loading";
import Link from "next/link";


interface ChatPageProps {
  params: {
    chatId: string;
  };
}

const ChatPage: FC<ChatPageProps> = async ({ params }) => {
  const { user: loggedInUser } = await validateRequest();
  if (!loggedInUser) return null;


  const conversation = await prisma.conversation.findUnique({
    where: {
      id: params.chatId,
    },
    select: {
      id: true,
      users: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
        },
      },
      messages: {
        orderBy: {
          createdAt: 'asc'
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          senderId: true
        }
      }
    },
  });

  if(!conversation) return null


  const externalUser = conversation?.users.find(
    (user) => user.id !== loggedInUser.id,
  );

  return (
    <div className="flex w-full h-screen flex-col  relative ">
      <div className=" sticky w-full top-0 left-0 flex items-center justify-between border-b bg-background px-4 py-2">
        <div className="flex items-center gap-4">
          <Link href='/chats'>
          <ArrowLeft />
          </Link>
          <UserAvatar avatarUrl={externalUser?.avatarUrl} className="h-10 w-10" />
          <div className="grid gap-0.5">
            <div className="font-medium">{externalUser?.displayName}</div>
            <div className="text-sm text-muted-foreground">Active 2h ago</div>
            {/* TODO: Add isOnline functionality  */}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <PhoneIcon className="h-4 w-4" />
            <span className="sr-only">Call</span>
          </Button>
          <Button variant="ghost" size="icon">
            <VideoIcon className="h-4 w-4" />
            <span className="sr-only">Video Call</span>
          </Button>
        </div>
      </div>



      <Conversation chatId={conversation.id}/>

      

      <SendMessage chatId={params.chatId}   />
    </div>
  );
};

export default ChatPage;
