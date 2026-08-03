"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import kyInstance from "@/lib/ky";
import { NotificationsPage } from "@/lib/types";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import Notification from "./Notification";

export default function Notifications() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/notifications",
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<NotificationsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: () => kyInstance.patch("/api/notifications/mark-as-read"),
    onSuccess: () => {
      queryClient.setQueryData(["unread-notification-count"], {
        unreadCount: 0,
      });
    },
    onError(error) {
      console.error("Failed to mark notifications as read", error);
    },
  });

  useEffect(() => {
    mutate();
  }, [mutate]);

  const notifications = data?.pages.flatMap((page) => page.notifications) || [];

  if (status === "pending") {
    return <PostsLoadingSkeleton />;
  }

  if (status === "success" && !notifications.length && !hasNextPage) {
    return (
      <div className="rounded-2xl border border-white/[0.07] bg-[#0f0f0f] p-10 text-center">
        <p className="font-display text-[18px] italic text-white">
          Nothing here yet.
        </p>
        <p className="mt-1 text-[13px] text-white/40">
          Jam requests, likes, and comments will show up here.
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="rounded-2xl border border-white/[0.07] bg-[#0f0f0f] p-8 text-center text-[13px] text-white/52">
        Couldn&apos;t load your notifications. Try again in a moment.
      </div>
    );
  }

  return (
    <InfiniteScrollContainer
      className="space-y-3"
      onBottomReached={() => {
        if (hasNextPage && !isFetching && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
    >
      {notifications.map((notification) => (
        <Notification key={notification.id} notification={notification} />
      ))}
      {isFetchingNextPage && (
        <Loader2 className="mx-auto my-3 animate-spin text-white/40" />
      )}
    </InfiniteScrollContainer>
  );
}