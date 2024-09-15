import { useToast } from "@/components/ui/use-toast";
import { PostsPage } from "@/lib/types";
import { useUploadThing } from "@/lib/uploadthing";
import { SubmitSongValues, UpdateUserProfileValues } from "@/lib/validation";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";
import { addSongRequest } from "./actions";

export function useUpdateProfileMutation() {
  const { toast } = useToast();

  const router = useRouter();

  const queryClient = useQueryClient();

  const { startUpload: startSongUpload, isUploading   } = useUploadThing("radioSongRequest");

  const mutation = useMutation({
    mutationFn: async ({
      songDetails,
      song,
    }: {
      songDetails: SubmitSongValues;
      song: File;
    }) => {
      return Promise.all([
        addSongRequest(songDetails),
      ]);
    },
    onSuccess: async ([updatedUser]) => {
      

      const queryFilter: QueryFilters = {
        queryKey: ["radio-song-submission"],
      };

      toast({
        description: "Song request has been made",
      });
    },
    onError(error) {
      toast({
        variant: "destructive",
        description:  "Some Error Occurred. Please try again!",
      });
    },
  });

  return mutation;
}