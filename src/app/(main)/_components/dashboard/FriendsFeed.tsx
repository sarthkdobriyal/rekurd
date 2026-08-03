"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import kyInstance from "@/lib/ky";
import EmptyDashboardState from "./EmptyDashboardState";
import ScanCard from "./ScanCard";
import { ScanFeedPage } from "./mock-data";

function ScanCardSkeleton() {
  return (
    <div className="mb-3.5 animate-pulse rounded-2xl border border-white/[0.07] bg-[#0f0f0f] p-4">
      <div className="mb-3.5 flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-full bg-white/[0.06]" />
        <div className="h-3 w-32 rounded bg-white/[0.06]" />
      </div>
      <div className="flex gap-3.5">
        <div className="h-[88px] w-[88px] flex-shrink-0 rounded-xl bg-white/[0.06]" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-5 w-2/3 rounded bg-white/[0.06]" />
          <div className="h-3 w-1/3 rounded bg-white/[0.06]" />
          <div className="h-4 w-24 rounded-full bg-white/[0.06]" />
        </div>
      </div>
    </div>
  );
}

export default function FriendsFeed() {
  const { data, hasNextPage, fetchNextPage, isFetching, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["scan-feed", "friends"],
      queryFn: ({ pageParam }) =>
        kyInstance
          .get(
            "/api/scans/friends",
            pageParam ? { searchParams: { cursor: pageParam } } : {},
          )
          .json<ScanFeedPage>(),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  const scans = data?.pages.flatMap((page) => page.scans) || [];

  if (status === "pending") {
    return (
      <>
        <ScanCardSkeleton />
        <ScanCardSkeleton />
        <ScanCardSkeleton />
      </>
    );
  }

  if (status === "error") {
    return (
      <div className="rounded-2xl border border-white/[0.07] bg-[#0f0f0f] p-8 text-center text-[13px] text-white/52">
        Couldn&apos;t load your friends&apos; scans. Try again in a moment.
      </div>
    );
  }

  if (!scans.length) {
    return (
      <EmptyDashboardState
        eyebrow="No scans yet"
        title="Your connections haven't scanned anything."
        body="When musicians you've JAMmed with identify a track, it shows up here. Find a few people to connect with to fill your feed."
        secondaryLabel="Discover musicians"
        secondaryHref="/discover"
      />
    );
  }

  return (
    <InfiniteScrollContainer
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {scans.map((scan) => (
        <ScanCard key={scan.id} scan={scan} />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin text-white/40" />}
    </InfiniteScrollContainer>
  );
}
