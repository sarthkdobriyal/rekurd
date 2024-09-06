import { Message as MessageType } from '@prisma/client'
import { FC } from 'react'

interface MessageProps {

  message: Partial<MessageType>,
  loggedInUserId: string
}

const Message: FC<MessageProps> = ({ message, loggedInUserId}) => {
  return   <div
    className={`flex w-fit max-w-[65%] flex-col gap-2 break-words  ${
      message.senderId === loggedInUserId
        ? "ml-auto bg-primary text-primary-foreground"
        : "bg-muted"
    } rounded-xl px-4 py-2 text-base prose-sm`}
    
  >
    {message.content}
  </div>
}

export default Message