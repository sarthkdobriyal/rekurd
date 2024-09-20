"use client"

import kyInstance from '@/lib/ky'
import { PublicRadioData, RadioSongPlaybackState } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'
import { Pause, Volume, Volume2 } from 'lucide-react'
import Image from 'next/image'
import { FC } from 'react'

interface PublicRadioPlayerProps {}

const PublicRadioPlayer: FC<PublicRadioPlayerProps> = ({}) => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["radio-public-data"],
    queryFn: () =>
      kyInstance
        .get("/api/radioQueue/public-radio-data")
        .json<PublicRadioData>(),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col w-full gap-y-4">
        <div className="relative  bg-zinc-800 animate-pulse rounded-xl h-52 w-52"></div>
        <div className="flex flex-col gap-y-1">
          <div className="flex items-center gap-x-3">
            <div className="bg-zinc-800 animate-pulse rounded-xl h-6 w-48"></div>
            <Volume2 className="text-muted-foreground" />
          </div>
          <div className="bg-zinc-800 animate-pulse rounded-xl h-4 w-32"></div>
        </div>
        <div className="flex gap-x-2 font-sans items-center font-light">
          <span className="text-xs">Up next: </span>
          <div className="bg-zinc-800 animate-pulse rounded-xl h-4 w-48"></div>
          <span className="text-xs">by </span>
          <div className="bg-zinc-800 animate-pulse rounded-xl h-4 w-32"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return <div className="flex items-center justify-center w-full text-center text-muted-foreground">Error loading data</div>;
  }

  if (!data) {
    return <div className="flex items-center justify-center w-full text-center text-muted-foreground">No song is currently playing</div>;
  }

  const { currentPlaybackState, lastQueueEntry } = data;

  return (
    <div className="flex flex-col w-full gap-y-4">
      <div className={`relative w-fit  ${currentPlaybackState?.paused && "opacity-40" }`}>
      <Image 
        src={currentPlaybackState?.song.albumArtUrl || '/record.jpg'}
        alt="record"
        width={200}
        height={200}
        className={`object-contain ${currentPlaybackState?.paused && "bg-opacity-10" }}`}
      />
      {
        currentPlaybackState?.paused && (
          <div className="absolute top-0 left-0 w-full h-full justify-center border flex items-center gap-x-2">
            <Pause className="text-muted-foreground" size="100" />
          </div>
        )
      }
      </div>

      <div className="flex flex-col gap-y-1">
        <div className="flex items-center gap-x-3">
          <span className="font-sans text-xl font-semibold">{currentPlaybackState?.song.title}</span>
          <Volume2 className="text-muted-foreground" />
          
        </div>
        <span className="text-muted-foreground text-base font-sans">{currentPlaybackState?.song.user.username}</span>
      </div>

      <div className="flex gap-x-2 font-sans items-center font-light">
        <span className="text-xs">Up next: </span>
        <span className="text-base">{lastQueueEntry?.song.title || "No next song"}</span>
        <span className="text-xs">by </span>
        <span className="text-base">{lastQueueEntry?.song.user.username || "Unknown"}</span>
      </div>
    </div>
  );
}

export default PublicRadioPlayer;