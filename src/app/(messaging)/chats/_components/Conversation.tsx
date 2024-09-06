import prisma from '@/lib/prisma'
"use client"
import { MessageCircle } from 'lucide-react'
import { FC, useEffect, useRef } from 'react'

import { validateRequest } from '@/auth'
import { useToast } from '@/components/ui/use-toast'
import { Message as MessageType } from '@prisma/client'
import Message from './Message'
import { useSession } from '@/app/(main)/SessionProvider'

interface ConversationProps {
  messages: Partial<MessageType>[]
}


const Conversation: FC<ConversationProps> = ({messages}) => {

  const { user: loggedInUser } = useSession()
  

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);


  return <div className="flex-1 max-h-[90vh] h-[90vh] border overflow-y-auto py-4 px-2 overflow-hidden flex-2 scrollbar-hide ">
  <div className="flex flex-col gap-4">
    {messages.length === 0 ? (
      <div className="text-center text-muted-foreground flex justify-center items-center flex-col gap-y-2">
        <MessageCircle />
        Start a conversation
      </div>
    ) : (
      messages.map((message) => (
        <Message key={message.id} loggedInUserId={loggedInUser.id} message={message} />
      ))
    )}
  </div>
  <div ref={messagesEndRef} />
</div>
}

export default Conversation