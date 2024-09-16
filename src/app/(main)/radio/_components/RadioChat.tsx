"use client";

import { FC, useEffect, useRef } from "react";
import SendMessage from "./SendMessage";
import RadioChatMessage from "./RadioChatMessage";
import { useChatFetcher } from "@/hooks/useChatFetcher";
import MessagesSkeleton from "@/components/MessagesSkeleton";
import { useSession } from "../../SessionProvider";
import { RadioMessage } from "@/lib/types";
import DotAnimatedLoader from "@/components/DotAnimatedLoader";
import { Button } from "@/components/ui/button";
import RadioMessagesSkeleton from "@/components/RadioMessagesSkeleton";
import { useChatSocketConnection } from "@/hooks/useChatSocketConnection";

interface RadioChatProps {
  isModerator? : boolean
}

const RadioChat: FC<RadioChatProps> = ({isModerator}) => {
  const { user: loggedInUser } = useSession();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    data,
    status,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
  } = useChatFetcher({
    apiUrl: "/api/radio-chat-messages",
    queryKey: "radio-chat-messages",
    paramValue: "",
  });

  useChatSocketConnection({
    queryKey: "radio-chat-messages",
    addKey: `global-radio-chat-message`,
    paramValue: "",
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [data]);

  if (status === "pending") {
    return (
      <div className="w-full">
        <RadioMessagesSkeleton />
      </div>
    );
  }

  if (status === "error") {
    return <div className="h-full w-full">Error Occured</div>;
  }

  const renderMessages = () =>
    data.pages.map((page) =>
      page.messages.map((message) => (
        <RadioChatMessage
          key={message.id}
          loggedInUserId={loggedInUser.id}
          message={message as RadioMessage}
        />
      )),
    );

  console.log(data);

  return (
    <div className={`flex  ${isModerator ? "max-h-[20%]" : "max-h-[40%]"} w-full flex-col justify-between gap-y-2 `}>
      <div className="scrollbar-hide  flex h-full flex-col-reverse gap-y-2 overflow-y-scroll">
      
      <div className="mt-auto flex h-full flex-col-reverse overflow-auto scrollbar-hide gap-y-4">
        {renderMessages()}
        {hasNextPage && (
          <div className="flex justify-center">
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

      <SendMessage />
    </div>
  );
};

export default RadioChat;
