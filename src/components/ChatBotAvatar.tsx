"use client"
import { cn } from '@/lib/utils'
import { BotMessageSquare } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { FC } from 'react'

interface ChatBotAvatarProps {
  
}

const ChatBotAvatar: FC<ChatBotAvatarProps> = ({}) => {

    const pathname = usePathname()
    if (pathname === '/ai-chatbot') return <></>

  return <div className="lg:right-12 cursor-pointer hover:bg-background fixed bottom-20 right-3 z-50 flex aspect-square h-20 w-20 items-center justify-center rounded-full bg-muted lg:h-24 lg:w-24">
  <BotMessageSquare className={cn("h-14 w-14 ${} text-muted-foreground")} />
  {/* <span className="text-muted-foreground tracking-wider italic font-serif absolute text-sm">AI</span> */}
</div>
}

export default ChatBotAvatar