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

  if (!user) return null;
  if (!data) return null;

  const handleReorderQueue = async (newOrder: string[]) => {
    console.log(newOrder)



    // Update the database
    queueReorderMutation.mutate({
      ...newOrder
    });
  }
  console.log(data);
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
                <div
                  className="flex items-center rounded-xl px-4 py-3 shadow-inner shadow-gray-700"
                  key={song.id}
                >
                  <Image
                    src={song.song.albumArtUrl || "/record.jpg"}
                    alt={song.song.title}
                    className="h-16 w-16 object-contain"
                    width={30}
                    height={30}
                  />
                  <div className="flex-2 flex flex-col px-4">
                    <span className="font-sans text-lg font-semibold">
                      {song.song.title}
                    </span>
                    <span className="font-sans text-muted-foreground">
                      <Link href={`/user/${user.username}`}>
                        {song.song.user.username}
                      </Link>
                    </span>
                  </div>
                  <div className="ml-auto flex items-center space-x-3 px-3">
                    <Button
                      variant="ghost"
                      className="flex items-center"
                      size="sm"
                    >
                      <Play className="mr-2 size-4" />
                    </Button>
                    <RemoveSongFromQueueButton songId={song.songId} />
                    <Button onPointerDown={(e) => controls.start(e)} variant="ghost" className="flex flex-col">
                      <ArrowDownUp />
                    </Button>
                  </div>
                </div>
              </Reorder.Item>
            );
          })}
        </ScrollArea>
      </Reorder.Group>
    </div>
  );
};

export default CurrentQueue;
