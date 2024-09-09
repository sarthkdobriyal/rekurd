"use client"
import { Link } from "lucide-react";
import { FC, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { validateRequest } from "@/auth";
import { createChat } from "@/app/(messaging)/chats/actions";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSession } from "@/app/(main)/SessionProvider";

interface ViewConversationProps {
  externalUserId: string;
}

const ViewConversation: FC<ViewConversationProps> =  ({
  externalUserId,
}) => {

    const { user} = useSession()

    const router = useRouter();
    const [isPending, startTransition] = useTransition()
  
    const handleClick = async () => {
        startTransition(async () => {
            const conversationId = await createChat(externalUserId);
            if(conversationId){
                router.push(`/chats/${conversationId}`);
            }

        })
    };

  return (
      <Button onClick={() => handleClick()} disabled={isPending} variant="secondary" className=" flex w-full">
            Message
      </Button>
  );
};

export default ViewConversation;
