"use client"

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Post from "@/components/posts/Post";
import { Button } from "@/components/ui/button";
import kyInstance from "@/lib/ky";
import { PostData, PostsPage } from '@/lib/types';
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export default function ForYouFeed() {

    const {data, hasNextPage, fetchNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery({
        queryKey: ["post-feed", "for-you"],
        queryFn: ({pageParam}) => kyInstance.get("/api/posts/for-you", pageParam ? {searchParams: {cursor: pageParam}} : {}).json<PostsPage>(),
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor
    })

    const posts = data?.pages.flatMap((page) => page.posts) || []

    if(status === "pending"){
        return <div><Loader2 className="mx-auto animate-spin" /></div>
    }

    if(status === "error"){
        return <div className="text-center text-destructive">Failed to load posts</div>
    }

    console.log(data)

  return (
    <InfiniteScrollContainer
      className="space-y-5 "
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}