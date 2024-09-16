"use client"
import { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CirclePlus, Check } from "lucide-react";
import { AddSongToQueue, IsSongInQueue } from "../actions";
import { useToast } from "@/components/ui/use-toast";

interface AddToQueueButtonProps {
  songId: string;
  isReviewed: boolean;
  isModerator: boolean;
  isInQueue:boolean;
}

const AddToQueueButton: FC<AddToQueueButtonProps> = ({ songId, isReviewed, isModerator, isInQueue }) => {
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();

  const handleAddToQueue = async () => {
    if (!isReviewed) {
      toast({
        variant: "destructive",
        description: "Song must be reviewed before adding to queue.",
      });
      return;
    }

    if (!isModerator) {
      toast({
        variant: "destructive",
        description: "Only moderators can add songs to the queue.",
      });
      return;
    }

    setIsPending(true);
    try {
      await AddSongToQueue(songId);
      toast({
        variant: "default",
        description: "Song added to queue successfully!",
      });
    } catch (error) {
      console.error("Failed to add song to queue:", error);
      toast({
        variant: "destructive",
        description: "Failed to add song to queue.",
      });
    } finally {
      setIsPending(false);
    }
  };


  return (
    <Button variant="ghost" onClick={handleAddToQueue} className="text-xs flex items-center" disabled={isPending || isInQueue}>
      {isPending ? (
        <Loader2 className="mr-2 size-4 animate-spin" />
      ) : isInQueue ? (
        <Check className="mr-2 size-4 text-green-500" />
      ) : (
        <CirclePlus className="mr-2 size-4" />
      )}
      {isInQueue ? "Already in Queue" : "Add to Queue"}
    </Button>
  );
};

export default AddToQueueButton;