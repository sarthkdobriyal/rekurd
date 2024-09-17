import { useToast } from "@/components/ui/use-toast";
import kyInstance from "@/lib/ky";
import { PostsPage, RadioQueue } from "@/lib/types";
import { useUploadThing } from "@/lib/uploadthing";
import { SubmitSongValues, UpdateUserProfileValues } from "@/lib/validation";
import {
  InfiniteData,
  QueryFilters,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";


export function useRadioQueueReorderMutation() {
  const { toast } = useToast();

  const router = useRouter();

  const queryClient = useQueryClient();

  const queryKey: QueryKey = ["radio-queue"];

  const  mutation = useMutation({
    mutationFn: (data: string[]) => kyInstance.post(`/api/radioQueue/reorder`, {
        json: {
            newOrder: data
        }
    }),
    onMutate: async (newOrder: string[]) => {
        await queryClient.cancelQueries({ queryKey });
        console.log(newOrder);

        const previousState = queryClient.getQueryData<RadioQueue>(queryKey);

        if (!previousState) return { previousState };

        const newOrderArray = Object.values(newOrder);

        // Reorder the previous state based on the new order array
        const newState = newOrderArray
          .map((id) => previousState.find((song) => song.id === id))
          .filter(Boolean) as RadioQueue;

        // Set the new state in the query client
        queryClient.setQueryData<RadioQueue>(queryKey, newState);

        return { previousState };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again.",
      });
    },
  });
  

  return mutation;
}