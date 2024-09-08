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
    pageSize: 15,
    paramKey: "chatId",
    paramValue: chatId,
  });

  useChatSocketConnection({
    queryKey: "chat-messages",
    addKey: `chat-${chatId}-messages`,
    paramValue: chatId,
  });

  console.log(data, " data");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [data]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  if (status === "pending") {
    return <div className="h-full">
      <MessagesSkeleton />
    </div>
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
    <div className="scrollbar-hide h-[90vh] max-h-[90vh] overflow-hidden overflow-y-auto px-2 py-4">
      <div className="flex flex-col gap-4">
        <div className="mt-auto flex flex-col-reverse gap-y-4">
          {renderMessages()}
        </div>
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default Conversation;
