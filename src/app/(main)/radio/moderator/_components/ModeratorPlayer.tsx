"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import useAudio from "@/hooks/useAudio";
import kyInstance from "@/lib/ky";
import { RadioSongPlaybackState } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Ban,
  ChevronLast,
  Loader2,
  Pause,
  Play,
  Repeat1,
  Volume,
  Volume2,
} from "lucide-react";
import Image from "next/image";
import { FC, useEffect } from "react";

interface ModeratorPlayerProps {}

const ModeratorPlayer: FC<ModeratorPlayerProps> = ({}) => {
  const { data, isError, isPending } = useQuery({
    queryKey: ["radio-currently-playing"],
    queryFn: () =>
      kyInstance
        .get("/api/radioQueue/currently-playing")
        .json<RadioSongPlaybackState>(),
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  console.log(Number(data?.pausedAt), "data");
  const playSongMutation = useMutation({
    mutationFn: () => kyInstance.post("/api/web-socket/radio/play").json(),
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["radio-currently-playing"] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: error.message,
      });
    },
  });
  const pauseSongMutation = useMutation({
    mutationFn: (seek: number) =>
      kyInstance.post("/api/web-socket/radio/pause", { json: { seek } }).json(),
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["radio-currently-playing"] });
      // songAudio.stop()
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: error.message,
      });
    },
  });

  const playNextSongMutation = useMutation({
    mutationFn: () => kyInstance.post("/api/web-socket/radio/playNext").json(),
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["radio-currently-playing"] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: error.message,
      });
    },
  });

  const songAudio = useAudio(
    data?.song.fileUrl || "",
    () => {
      // songAudio.stop();
      // playNextSongMutation.mutate();
    },
    () => {},
  );

  // console.log(songAudio.duration, "duration")
  // useEffect(() => {
  //   if (data && !songAudio.isPlaying()) {
  //     if (data.paused) {
  //       songAudio.pause()
  //     } else {
  //       const pausedAt = Number(data.pausedAt) || 0;
  //       songAudio.playFrom(pausedAt);
  //     }
  //   }
  // }, [data, songAudio]);

  if (!data) {
    return (
      <div className="flex w-full items-center justify-center text-center text-muted-foreground">
        No song is currently playing
      </div>
    );
  }

  const handlePlayPauseClick = () => {
    songAudio.playPauseSong(data.paused ? Number(data.pausedAt) : 0);
  };

  return (
    <div className="flex w-full flex-col gap-y-4">
      <div className="flex gap-x-3">
        <Image
          src={data.song.albumArtUrl || "/record.jpg"}
          alt="record"
          width={50}
          height={50}
          className="object-contain"
        />

        <div className="flex w-full flex-col gap-y-1 text-xs">
          <div className="flex items-center gap-x-3">
            <span className="font-sans text-xl font-semibold">
              {data.song.title}
            </span>
            <div
              className="cursor-pointer text-muted-foreground"
              onClick={songAudio.muteUnmute}
            >
              {songAudio.isMuted ? <Volume /> : <Volume2 />}
            </div>
          </div>
          <div className="flex justify-between font-sans text-base text-muted-foreground">
            <span className="font-sans text-base text-muted-foreground">
              {data.song.user.username}
            </span>
            {/* <CurrentPlaybackTime currentTime={songAudio.currentTime} duration={songAudio.duration} /> */}
          </div>
        </div>
      </div>

      <div className="flex cursor-pointer items-center justify-between px-20 font-sans font-light">
        <Button
          variant="ghost"
          className="text-xs"
          onClick={handlePlayPauseClick}
          disabled={playSongMutation.isPending || pauseSongMutation.isPending}
        >
          {playSongMutation.isPending || pauseSongMutation.isPending ? (
            <Loader2 className="animate-spin" />
          ) : songAudio.isPlaying ? (
            <Pause /> 
          ) : (
            <Play />
          )}
        </Button>
        <Button
          variant="ghost"
          className="text-xs"
          onClick={() => playNextSongMutation.mutate()}
          disabled={playNextSongMutation.isPending}
        >
          {playNextSongMutation.isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <ChevronLast />
          )}
        </Button>
        <Button variant="ghost" className="text-xs">
          <Ban className="" />
        </Button>
        <Button variant="ghost" className="text-xs">
          <Repeat1 className="" />
        </Button>
      </div>
    </div>
  );
};

export default ModeratorPlayer;
