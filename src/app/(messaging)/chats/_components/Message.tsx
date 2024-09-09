import { Message as MessageType } from "@prisma/client";
import { FC } from "react";

interface MessageProps {
  message: Partial<MessageType>;
  loggedInUserId: string;
}

const Message: FC<MessageProps> = ({ message, loggedInUserId }) => {
  const isSender = message.senderId === loggedInUserId;

  return (
    <div
      className={`flex w-fit max-w-[65%] flex-col gap-1 break-words ${
        isSender ? "ml-auto bg-primary text-primary-foreground" : "bg-muted"
      } rounded-xl px-4 py-2 text-base`}
      
    >
      <div className="flex items-center gap-x-2">
      {!isSender && <span
          className={`tracking-tighter text-xs font-light ${isSender ? "text-muted" : "text-muted-foreground"}`}
        >
          {formatTimestampTo24Hr(message.createdAt!)}
        </span>}
        <p className="prose-sm text-base font-sans">{message.content}</p>
        {isSender && <span
          className={`tracking-tighter text-xs font-light ${isSender ? "text-muted" : "text-muted-foreground"}`}
        >
          {formatTimestampTo24Hr(message.createdAt!)}
        </span>}
      </div>
    </div>
  );
};

export const formatTimestampTo24Hr = (timestamp: Date) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default Message;
