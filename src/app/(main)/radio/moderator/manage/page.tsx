import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { FC } from 'react'
import CurrentQueue from '../_components/CurrentQueue'
import AllRequestedSongs from '../_components/AllRequestedSongs'

interface ManageSongsPageProps {
  
}

const ManageSongsPage: FC<ManageSongsPageProps> = ({}) => {
  return <div className='flex flex-col  h-full w-full'>
    <div className='flex  px-5 pb-5 '>
        <Link href='/radio/moderator'>
          <ArrowLeft />
        </Link>
        <span className="font-semibold mx-auto text-lg ">
                Manage Songs
        </span>
    </div>

    <Tabs defaultValue="all-songs">
          <TabsList>
            <TabsTrigger value="current-queue">Current Queue</TabsTrigger>
            <TabsTrigger value="all-songs">All Songs</TabsTrigger>
          </TabsList>
          <TabsContent value="current-queue">
            <CurrentQueue />
          </TabsContent>
          <TabsContent value="all-songs">
            <AllRequestedSongs />
          </TabsContent>
        </Tabs>
    
  </div>
}

export default ManageSongsPage