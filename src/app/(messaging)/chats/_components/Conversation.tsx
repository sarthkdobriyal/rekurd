"use client";

import { MessageCircle } from "lucide-react";
import { FC, useEffect, useRef } from "react";
import prisma from "@/lib/prisma";

import { validateRequest } from "@/auth";
import { useToast } from "@/components/ui/use-toast";
import { Message as MessageType } from "@prisma/client";
import Message from "./Message";
import { useSession } from "@/app/(main)/SessionProvider";
import { useChatFetcher } from "@/hooks/useChatFetcher";
import DotAnimatedLoader from "@/components/DotAnimatedLoader";
import { useChatSocketConnection } from "@/hooks/useChatSocketConnection";
import MessagesSkeleton from "@/components/MessagesSkeleton";
import { Button } from "@/components/ui/button";

interface ConversationProps {
  chatId: string;
}

const Conversation: FC<ConversationProps> = ({ chatId }) => {
  const { user: loggedInUser } = useSession();

  const {
    data,
    status,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
  } = useChatFetcher({
    apiUrl: "/api/messages",
    queryKey: "chat-messages",
    paramValue: chatId,
  });

  useChatSocketConnection({
    queryKey: "chat-messages",
    addKey: `chat-${chatId}-messages`,
    paramValue: chatId,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [data]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  if (status === "pending") {
    return (
      <div className="h-full">
        <MessagesSkeleton />
      </div>
    );
  }

  if (status === "error") {
    return <div className="h-full w-full">Error Occured</div>;
  }


  const renderMessages = () =>
    data.pages.map((page) =>
      page.messages.map((message) => (
        <Message
          key={message.id}
          loggedInUserId={loggedInUser.id}
          message={message}
        />
      )),
    );

  return (
    <div className="scrollbar-hide h-[90vh] max-h-[90vh] overflow-hidden  px-2 py-4 mb-4">
      

        
      
        <div className="mt-auto flex h-full flex-col-reverse overflow-auto scrollbar-hide gap-y-4">
          {renderMessages()}
          {!hasNextPage && <div className="text-center text-muted tracking-widest text-xl">--END--</div>}
          {hasNextPage && (
        <div className="flex justify-center ">
          {isFetchingNextPage ? (
            <DotAnimatedLoader />
          ) : (
            <Button variant="link" onClick={() => fetchNextPage()}>
              Load Previous Messages
            </Button>
          )}
        </div>
      )}
        </div>
        <div ref={messagesEndRef} />
    </div>
  );
};

export default Conversation;
