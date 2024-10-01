"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Play, ArrowDownUp, Pause } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import RemoveSongFromQueueButton from "./RemoveSongFromQueueButton";
import { useDragControls } from "framer-motion";
import { RadioSong } from "@/lib/types";
import useAudio from "@/hooks/useAudio";


interface CurrentQueueItemProps {
    song: {
        id: string;
        title: string;
        fileUrl: string;
        duration: number | null;
        isReviewed: boolean;
        albumArtUrl: string | null;
        userId: string;
        createdAt: Date;
        user: {
          id: string;
          username: string;
          avatarUrl: string | null;
        };
      };
  user: {
    id: string;
    username: string;
    avatarUrl: string | null;
  }
  }


const CurrentQueueItem: FC<CurrentQueueItemProps> = ({ song, user }) => {
  const controls = useDragControls();
  const { isPlaying, playStopSong } = useAudio(song.fileUrl, );



  return (
    <div className="flex items-center rounded-xl px-4 py-3 shadow-inner shadow-gray-700" key={song.id}>
      <Image
        src={song.albumArtUrl || "/record.jpg"}
        alt={song.title}
        className="h-16 w-16 object-contain"
        width={30}
        height={30}
      />
      <div className="flex-2 flex flex-col px-4">
        <span className="font-sans text-lg font-semibold">
          {song.title}
        </span>
        <span className="font-sans text-muted-foreground">
          <Link href={`/user/${user.username}`}>
            {song.user.username}
          </Link>
        </span>
      </div>
      <div className="ml-auto flex items-center space-x-3 px-3">
        <Button onClick={playStopSong} variant="ghost" className="flex items-center" size="sm">
          {isPlaying ? <Pause className="mr-2 size-4" /> : <Play className="mr-2 size-4" />}
        </Button>
        <RemoveSongFromQueueButton songId={song.id} />
        <Button onPointerDown={(e) => controls.start(e)} variant="ghost" className="flex flex-col">
          <ArrowDownUp />
        </Button>
      </div>
    </div>
  );
};

export default CurrentQueueItem;