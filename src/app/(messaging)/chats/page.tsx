import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import UserAvatar from '@/components/UserAvatar'
import { ArrowLeft, PhoneIcon, PlusIcon, SendIcon, VideoIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'
import ChatList from './_components/ChatList'
import CreateChatDialog from './_components/CreateChatDialog'
import { validateRequest } from '@/auth'
import { getConnectedUsers } from './actions'

interface ChatsPageProps {
  
}

const ChatsPage: FC<ChatsPageProps> = async ({}) => {


  const {user: loggedInUser} = await validateRequest()

  if(!loggedInUser) throw new Error('Unauthorized')

  const connectedUsers = await getConnectedUsers(loggedInUser.id)

  return <div className="min-h-full w-full  overflow-hidden">
    <div className="flex h-14 items-center justify-between border-b px-4">
    <ArrowLeft />
    <div className="font-medium text-xl ">All your Chats</div>
    <CreateChatDialog  connectedUsers={connectedUsers}/>
  </div>
      <ChatList />
  </div>
}

export default ChatsPage