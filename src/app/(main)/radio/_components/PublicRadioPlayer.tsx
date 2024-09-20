"use client";

import { UseRadioSocketConnection } from "@/hooks/useRadioSocketConnection";
import kyInstance from "@/lib/ky";
import { PublicRadioData, RadioSongPlaybackState } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { BoomBox, Pause, Volume, Volume2 } from "lucide-react";
import Image from "next/image";
import { FC } from "react";

interface PublicRadioPlayerProps {}

const PublicRadioPlayer: FC<PublicRadioPlayerProps> = ({}) => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["radio-public-data"],
    queryFn: () =>
      kyInstance
        .get("/api/radioQueue/public-radio-data")
        .json<PublicRadioData>(),
  });


  console.log(data, "data")
  UseRadioSocketConnection({
    queryKey: "radio-public-data"
  });

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-y-4">
        <div className="relative h-52 w-52 animate-pulse rounded-xl bg-zinc-800"></div>
        <div className="flex flex-col gap-y-1">
          <div className="flex items-center gap-x-3">
            <div className="h-6 w-48 animate-pulse rounded-xl bg-zinc-800"></div>
            <Volume2 className="text-muted-foreground" />
          </div>
          <div className="h-4 w-32 animate-pulse rounded-xl bg-zinc-800"></div>
        </div>
        <div className="flex items-center gap-x-2 font-sans font-light">
          <span className="text-xs">Up next: </span>
          <div className="h-4 w-48 animate-pulse rounded-xl bg-zinc-800"></div>
          <span className="text-xs">by </span>
          <div className="h-4 w-32 animate-pulse rounded-xl bg-zinc-800"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex w-full items-center justify-center text-center text-muted-foreground">
        Error loading data
      </div>
    );
  }

  if (!data?.currentPlaybackState) {
    return (
      <div className="flex w-full h-[30%] justify-center items-center flex-col gap-y-4">
      

      <BoomBox size={36} strokeWidth={1.75} absoluteStrokeWidth />
      <span className="font-semibold font-sans ">
        Radio is currently off
      </span>

    </div>
    );
  }

  const { currentPlaybackState, lastQueueEntry } = data;

  return (
    <div className="flex w-full flex-col gap-y-4">
      <div
        className={`relative w-fit ${currentPlaybackState?.paused && "opacity-40"}`}
      >
        <Image
          src={currentPlaybackState?.song.albumArtUrl || "/record.jpg"}
          alt="record"
          width={200}
          height={200}
          className={`object-contain ${currentPlaybackState?.paused && "bg-opacity-10"}}`}
        />
        {currentPlaybackState?.paused && (
          <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center gap-x-2 border">
            <Pause className="text-muted-foreground" size="100" />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-y-1">
        <div className="flex items-center gap-x-3">
          <span className="font-sans text-xl font-semibold">
            {currentPlaybackState?.song.title}
          </span>
          <Volume2 className="text-muted-foreground" />
        </div>
        <span className="font-sans text-base text-muted-foreground">
          {currentPlaybackState?.song.user.username}
        </span>
      </div>

      <div className="flex items-center gap-x-2 font-sans font-light">
        <span className="text-xs">Up next: </span>
        <span className="text-base">
          {lastQueueEntry?.song.title || "No next song"}
        </span>
        <span className="text-xs">by </span>
        <span className="text-base">
          {lastQueueEntry?.song.user.username || "Unknown"}
        </span>
      </div>
    </div>
  );
};

export default PublicRadioPlayer;
