"use client";

import kyInstance from "@/lib/ky";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "../SessionProvider";
import type { DiscoverPage } from "@/app/api/discover/route";
import ArtistCard from "./_components/ArtistCard";
import ArtistsCardSkeleton from "./_components/ArtistsCardSkeleton";
import EmptyDashboardState from "../_components/dashboard/EmptyDashboardState";

function Artists() {
  const { user: loggedInUser } = useSession();

  const { data, status } = useQuery({
    queryKey: ["discover-users"],
    queryFn: () => kyInstance.get("/api/discover").json<DiscoverPage>(),
  });

  if (!loggedInUser) return null;

  if (status === "pending") {
    return (
      <div className="grid grid-cols-1 gap-3.5 px-4 pb-16 pt-4 sm:grid-cols-2 sm:px-7 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ArtistsCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="mx-4 mt-4 rounded-2xl border border-white/[0.07] bg-[#0f0f0f] p-8 text-center text-[13px] text-white/52 sm:mx-7">
        Couldn&apos;t load musicians. Try again in a moment.
      </div>
    );
  }

  if (!data.users.length) {
    return (
      <div className="px-4 pt-2 sm:px-7">
        <EmptyDashboardState
          eyebrow="All caught up"
          title="No new musicians to discover."
          body="You've already connected with everyone we can suggest right now. Check back soon — new artists join rekurd all the time."
          secondaryLabel="Back to your feed"
          secondaryHref="/"
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3.5 px-4 pb-16 pt-4 sm:grid-cols-2 sm:px-7 lg:grid-cols-3">
      {data.users.map((user) => (
        <ArtistCard key={user.id} artist={user} loggedInUserId={loggedInUser.id} />
      ))}
    </div>
  );
}

export default Artists;
