"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import kyInstance from "@/lib/ky";
import { RadioQueue } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDownUp, CircleX, Loader2, Minus, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC, useState } from "react";
import { RemoveSongFromQueue } from "../actions";
import RemoveSongFromQueueButton from "./RemoveSongFromQueueButton";
import { Reorder, useDragControls } from "framer-motion";
import { useRadioQueueReorderMutation } from "../mutations";
import CurrentQueueItem from "./CurrentQueueItem";

interface CurrentQueueProps {}

const CurrentQueue: FC<CurrentQueueProps> = ({}) => {
  const { user } = useSession();

  const queryClient = useQueryClient();

  const { data, isError, isLoading, refetch, status } = useQuery({
    queryKey: ["radio-queue"],
    queryFn: ({ pageParam }) =>
      kyInstance.get("/api/radioQueue").json<RadioQueue>(),
  });

  const queueReorderMutation = useRadioQueueReorderMutation();
  const controls = useDragControls();

  if (!user) return null;
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading queue</div>;
  if (!data || data.length === 0)
    return (
      <div className="flex w-full items-start justify-center py-4 text-muted-foreground">
        No songs in queue
      </div>
    );

  if (!user) return null;
  if (!data) return null;

  const handleReorderQueue = async (newOrder: string[]) => {
    console.log(newOrder);

    // Update the database
    queueReorderMutation.mutate({
      ...newOrder,
    });
  };
  console.log(data[0]);
  return (
    <div className="h-full max-h-[95%] w-full">
      <Reorder.Group
        axis="y"
        values={data.map((song) => song.id)}
        onReorder={(newOrder) => handleReorderQueue(newOrder)}
        layoutScroll
        dragListener={false}
        style={{ overflowY: "auto" }}
      >
        <ScrollArea className="h-full w-full gap-y-2">
          {data.map((song) => {
            return (
              <Reorder.Item
                dragControls={controls}
                key={song.id}
                value={song.id}
              >
                <CurrentQueueItem  song={song.song} user={user}/>
              </Reorder.Item>
            );
          })}
        </ScrollArea>
      </Reorder.Group>
    </div>
  );
};

export default CurrentQueue;
