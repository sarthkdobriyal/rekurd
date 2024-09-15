import { FC } from 'react'
import { RadioChatMessage as MessageType } from "@prisma/client";
import { formatTimestampTo24Hr } from '@/app/(messaging)/chats/_components/Message';
import { RadioMessage, RadioMessagePage } from '@/lib/types';

interface RadioChatMessageProps {
  message: RadioMessage
  loggedInUserId: string;
}

const RadioChatMessage: FC<RadioChatMessageProps> = ({message, loggedInUserId}) => {
  const isSender = message.userId === loggedInUserId;
  
  return <div className="flex flex-col">
  <div className="flex items-center gap-x-2">
    <span className="font-sans text-sm font-semibold">{message.user.username}</span>
    <span className="font-sans text-xs text-muted-foreground">
    {formatTimestampTo24Hr(message.createdAt!)}
    </span>
  </div>
  <span className="font-sans text-sm prose-sm text-muted-foreground">
    {message.content}
  </span>
</div>
}

export default RadioChatMessage