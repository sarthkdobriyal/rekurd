import { useSocket } from "@/app/providers/web-socket";
import { PublicRadioData, RadioMessage } from "@/lib/types";
import { Message } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";

import { useCallback, useEffect } from "react";

type UseRadioSocketConnectionProps = {
  queryKey: string;
};

export const UseRadioSocketConnection = ({
  queryKey,
}: UseRadioSocketConnectionProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  const handleNewRadioData = (radioData: PublicRadioData) => {
    console.log("New Radio data", radioData, queryKey);
     queryClient.setQueryData<PublicRadioData>(
      [queryKey],
      (prev: PublicRadioData | undefined) => {
        console.log(prev, "[prev]");
        if (!prev) return radioData;

        console.log(prev, "prev");
        console.log(radioData, "radioData");

        const newRadioData: PublicRadioData = {
          currentPlaybackState: {
            ...radioData.currentPlaybackState!,
            song: {
              ...radioData.currentPlaybackState?.song!,
              user: { ...radioData.currentPlaybackState?.song?.user! },
            },
          },
          lastQueueEntry: radioData.lastQueueEntry
            ? {
                ...radioData.lastQueueEntry,
                song: {
                  ...radioData.lastQueueEntry.song,
                  user: { ...radioData.lastQueueEntry.song.user },
                },
              }
            : prev.lastQueueEntry
            ? {
                ...prev.lastQueueEntry,
                song: {
                  ...prev.lastQueueEntry.song,
                  user: { ...prev.lastQueueEntry.song.user },
                },
              }
            : null,
        };

        
        console.log(newRadioData, "newRadioData");
        return newRadioData;
      },
    );
    // queryClient.invalidateQueries(["radio-public-data"])
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("global-radio-playback-state", handleNewRadioData);

    return () => {
      socket.off("global-radio-playback-state", handleNewRadioData);
    };
  }, [queryKey, queryClient, socket]);
};
