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
  // console.log(songs);

  return <div className="w-full h-full max-h-[95%]">
  <ScrollArea className="w-full h-full">
    {await Promise.all(
      songs.map(async (song) => {
        const isInQueue = await checkIfInQueue(song.id);
        return (
          <div className="px-4 py-3 border-b flex items-center" key={song.id}>
            <Image
              src={song.albumArtUrl || "/record.jpg"}
              alt={song.title}
              className="w-16 h-16 object-contain"
              width={50}
              height={50}
            />
            <div className="flex flex-2 flex-col px-4">
              <span className="text-lg font-semibold font-sans">{song.title}</span>
              <span className="text-muted-foreground font-sans">
                <Link href={`/user/${user.username}`}>{song.user.username}</Link>
              </span>
            </div>
            <div className="ml-auto px-3 flex items-center space-x-3">
              <Button variant="ghost" className="flex items-center" size="sm">
                <Play className="mr-2 size-4" />
              </Button>
              <AddToQueueButton
                songId={song.id}
                isReviewed={song.isReviewed}
                isModerator={true}
                isInQueue={isInQueue || false}
              />
              <SongOptions
                artistUsername={user.username}
                songId={song.id}
                isReviewed={song.isReviewed}
              />
            </div>
          </div>
        );
      })
    )}
  </ScrollArea>
</div>
};

export default AllRequestedSongs;
