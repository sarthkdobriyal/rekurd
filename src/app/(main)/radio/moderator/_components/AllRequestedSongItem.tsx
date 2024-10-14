"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pause, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AddToQueueButton from "./AddToQueue";
import SongOptions from "./SongOptions";
import { Howl } from "howler";
import { IsSongInQueue } from "../actions";
import useAudio from "@/hooks/useAudio";

interface AllRequestedSongItemProps {
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
  };
  isInQueue: boolean;
}

const AllRequestedSongItem: FC<AllRequestedSongItemProps> = ({
  song,
  user,
  isInQueue,
}) => {
  const {isPlaying, playStopSong} = useAudio(song.fileUrl)

  return (
    <div
      className="flex items-center px-4 py-3 shadow-sm shadow-gray-700"
      key={song.id}
    >
      <Image
        src={song.albumArtUrl || "/record.jpg"}
        alt={song.title}
        className="h-16 w-16 object-contain"
        width={50}
        height={50}
      />
      <div className="flex-2 flex flex-col px-4">
        <span className="font-sans text-lg font-semibold">{song.title}</span>
        <span className="font-sans text-muted-foreground">
          <Link href={`/user/${user.username}`}>{song.user.username}</Link>
        </span>
      </div>
      <div className="ml-auto flex items-center space-x-3 px-3">
        <Button
          onClick={playStopSong}
          variant="ghost"
          className="flex items-center"
          size="sm"
        >
          {isPlaying ? (
            <Pause className="mr-2 size-4" />
          ) : (
            <Play className="mr-2 size-4" />
          )}
        </Button>
        <AddToQueueButton
          songId={song.id}
          isReviewed={song.isReviewed}
          isModerator={true}
          isInQueue={isInQueue}
        />
        <SongOptions
          artistUsername={user.username}
          songId={song.id}
          isReviewed={song.isReviewed}
        />
      </div>
    </div>
  );
};

export default AllRequestedSongItem;
