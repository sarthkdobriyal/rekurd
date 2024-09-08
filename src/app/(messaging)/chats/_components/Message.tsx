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
      style={{
        alignSelf: isSender ? "flex-end" : "flex-start",
        marginBottom: "8px",
        padding: "10px",
        borderRadius: "20px",
      }}
    >
      <div className="flex items-end justify-between">
        <p className="prose-sm font-sans">{message.content}</p>
        <span
          className={`text-xs font-light ${isSender ? "text-muted" : "text-muted-foreground"} ml-2`}
        >
          {formatTimestampTo24Hr(message.createdAt!)}
        </span>
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
