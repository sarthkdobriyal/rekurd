import { useToast } from "@/components/ui/use-toast";
import { InfiniteData, QueryFilters, useMutation, useQueryClient } from "@tanstack/react-query";
import { submitPost } from "./actions";
import next from "next";

export function useSubmitPostMutation() {
    const { toast } = useToast();

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: submitPost,
        onSuccess: async (newPost) => {
            const  queryFilter: QueryFilters = { queryKey: ["post-feed", "for-you"] }
            await queryClient.cancelQueries(queryFilter)
            queryClient.setQueriesData<InfiniteData<PostPage, string | null>>(queryFilter, (oldData) => {
                const firstPage = oldData.pages[0]
                if(firstPage){
                    return {
                        pageParams: oldData.pageParams,
                        pages: [
                            {
                                posts: [newPost, ...firstPage.posts],
                                nextCursor: oldData.nextCursor
                            },
                            ...oldData.pages.slice(1)
                        ]
                    }
                }
            })

            toast({
                description: "Post Created!"
            })
            
        },
        onError: (error) => {
            console.log(error);
            toast({
                variant: "destructive",
                description: "Failed to submit post",
            });
        }
    })

    return mutation
}  