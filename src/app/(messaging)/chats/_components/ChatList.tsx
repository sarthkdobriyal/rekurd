import { Button } from '@/components/ui/button'
import UserAvatar from '@/components/UserAvatar'
import { ArrowLeft, PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { FC } from 'react'
import CreateChatDialog from './CreateChatDialog'
import { getConnectedUsers } from '../actions'
import { validateRequest } from '@/auth'
import prisma from '@/lib/prisma'
import { formatRelativeDate } from '@/lib/utils'


interface ChatListProps {
  
}

const ChatList: FC<ChatListProps> = async ({}) => {

  const {user: loggedInUser} = await validateRequest()

  if(!loggedInUser) throw new Error('Unauthorized')

  
  const chats = await prisma.conversation.findMany({
    where: {
      users: {
        some: {
          id: loggedInUser.id
        }
      }
    },
    select: {
      id: true,
      users: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true
        }
      },
      messages: {
        orderBy: {
          createdAt: 'desc'
        },
        take: 1,
        select: {
          content: true,
          createdAt: true
        }
      }
    }
  })





  return <div className="h-[calc(100vh-3.5rem)] overflow-y-auto">
    <div className="grid gap-2 p-4">
      {
        chats?.map((chat) => (
          <Link
          key={chat.id}
          href={`/chats/${chat.id}`}
          className="flex items-center gap-4 rounded-lg bg-muted/50 p-3 hover:bg-muted"
          prefetch={false}
        >
            <UserAvatar avatarUrl={chat.users.find((user) => user.id !== loggedInUser.id)?.avatarUrl} className="h-10 w-10" /> 
          
          <div className="grid gap-0.5">
            <div className="font-medium">{
              chat.users.find((user) => user.id !== loggedInUser.id)?.displayName
              }</div>
            <div className="text-sm text-muted-foreground">
              {
                chat.messages[0]?.content || 'Start a conversation'
              }
            </div>
          </div>
          <div className="ml-auto text-xs text-muted-foreground">
            {
              formatRelativeDate(
                chat.messages[0]?.createdAt
              )
            }
          </div>
        </Link>
        ))
      }
      
    </div>
  </div>
}

export default ChatList