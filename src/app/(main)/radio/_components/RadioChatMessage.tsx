import { FC } from "react";
import { RadioChatMessage as MessageType } from "@prisma/client";
import { formatTimestampTo24Hr } from "@/app/(messaging)/chats/_components/Message";
import { RadioMessage, RadioMessagePage } from "@/lib/types";

interface RadioChatMessageProps {
  message: RadioMessage;
  loggedInUserId: string;
}

const RadioChatMessage: FC<RadioChatMessageProps> = ({
  message,
  loggedInUserId,
}) => {
  const isSender = message.userId === loggedInUserId;

  return (
    <div className="flex flex-col">
      <div className="flex items-start gap-x-3 ">
        <div className="flex gap-x-2">
          <span className="tracking-tightest font-sans text-xs text-muted-foreground">
            {formatTimestampTo24Hr(message.createdAt!)}
          </span>
          <span className="font-sans text-xs font-semibold tracking-tighter whitespace-nowrap overflow-hidden text-ellipsis">
            {message.user.username}
          </span>
        </div>
        <span className="prose-xs max-h-40 max-w-full overflow-hidden overflow-y-auto break-words font-sans text-sm text-muted-foreground">
          {message.content}
        </span>
      </div>
    </div>
  );
};

export default RadioChatMessage;
