"use client"

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Check,
  EllipsisVertical,
  ListCollapse,
  Loader2,
  MicVocal,
  Monitor,
  Trash2,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { FC, useTransition } from "react";
import { DeleteSong, MarkSongReviewed } from "../actions";
import { useToast } from "@/components/ui/use-toast";

interface SongOptionsProps {
  artistUsername: string;
  songId: string;
  isReviewed: boolean;
}

const SongOptions: FC<SongOptionsProps> = ({
  songId,
  artistUsername,
  isReviewed,
}) => {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
  
    const handleSongReview = async (event: React.MouseEvent) => {
      event.preventDefault(); // Prevent the dropdown from closing
      startTransition(async () => {
        try {
          await MarkSongReviewed(songId);
          toast({
            variant: "default",
            description: "Song marked as reviewed successfully!",
          });
        } catch (error) {
          console.error("Failed to mark song as reviewed:", error);
          toast({
            variant: "destructive",
            description: "Failed to mark song as reviewed.",
          });
        }
      });
    };

    const handleDeleteSong = async (event: React.MouseEvent) => {
        event.preventDefault(); // Prevent the dropdown from closing
        startTransition(async () => {
          try {
            await DeleteSong(songId);
            toast({
              variant: "default",
              description: "Song deleted successfully!",
            });
          } catch (error) {
            console.error("Failed to delete song:", error);
            toast({
              variant: "destructive",
              description: "Failed to delete song.",
            });
          }
        });
      };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <EllipsisVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Link href={`/users/${artistUsername}`}>
          <DropdownMenuItem>
            <MicVocal className="mr-2 size-4" />
            View Artist
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <ListCollapse className="mr-2 size-4" />
          View Song Details
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled={isReviewed}>
        {isReviewed ? (
            <div className="flex ">
              <Check className="mr-2 size-4 text-green-500" />
              Song Reviewed
            </div>
          ) : (
            <Button variant="outline" onClick={handleSongReview} disabled={isPending}>
              {isPending ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Check className="mr-2 size-4" />
              )}
              Mark as reviewed
            </Button>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem >
        <Button variant="destructive" className="w-full" onClick={handleDeleteSong} disabled={isPending}>
            {isPending ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 size-4" />
            )}
            Delete Song
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SongOptions;
