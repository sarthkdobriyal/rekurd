import { validateRequest } from "@/auth";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserTooltip from "@/components/UserTooltip";
import prisma from "@/lib/prisma";
import { CirclePlus, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import SongOptions from "./SongOptions";
import AddToQueueButton from "./AddToQueue";
import { isAuthUserRadioModerator } from "../../actions";
import { IsSongInQueue } from "../actions";
import { Howl } from 'howler'

import AllRequestedSongItem from "./AllRequestedSongItem";

interface AllRequestedSongsProps {}

const AllRequestedSongs: FC<AllRequestedSongsProps> = async ({}) => {

  const  user  = await isAuthUserRadioModerator();

  if(!user) return null;

  const songs = await prisma.radioSongRequest.findMany({
    include: {
      user: {
        select: {
          id: true,
          username: true,
          avatarUrl: true,
        },
      },
    },
    orderBy :{
      createdAt: 'desc'
    }
  });

  const checkIfInQueue = async (songId: string) => {
    try {
      const inQueue = await IsSongInQueue(songId);
      return !!inQueue
    } catch (error) {
      console.error("Failed to check if song is in queue:", error);
    }
  };
  


  return <div className="w-full h-full max-h-[95%]">
  <ScrollArea className="w-full h-full">
  {/* {songs.map((song) => (
          <AllRequestedSongItem key={song.id} song={song} user={user} />
        ))} */}
        {await Promise.all(
          songs.map(async (song) => {
            const isInQueue = await checkIfInQueue(song.id);
            return <AllRequestedSongItem key={song.id} song={song} user={user} isInQueue={isInQueue || false} />;
          })
        )}
  </ScrollArea>
</div>
};

export default AllRequestedSongs;
