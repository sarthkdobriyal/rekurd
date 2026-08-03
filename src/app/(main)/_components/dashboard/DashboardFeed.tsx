"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import type { DashboardRailsResponse } from "@/app/api/scans/dashboard/route";
import ClusterHeader from "./ClusterHeader";
import EmptyDashboardState from "./EmptyDashboardState";
import FilterPills from "./FilterPills";
import FriendsFeed from "./FriendsFeed";
import QuickScanBar from "./QuickScanBar";
import { RailSection } from "./RightRail";
import ScanCard from "./ScanCard";
import { FilterKey, nearbyFeed, nearbyTonight } from "./mock-data";

export default function DashboardFeed() {
  const [active, setActive] = useState<FilterKey>("friends");

  const { data: rails } = useQuery({
    queryKey: ["dashboard-rails"],
    queryFn: () =>
      kyInstance.get("/api/scans/dashboard").json<DashboardRailsResponse>(),
  });

  return (
    <div className="mx-auto flex w-full max-w-[1080px] gap-7 px-4 pb-16 pt-6 sm:px-7">
      <div className="min-w-0 flex-1 sm:max-w-[640px]">
        <QuickScanBar />
        <FilterPills active={active} onChange={setActive} />

        {active === "friends" && <FriendsFeed />}

        {active === "nearby" && (
          <>
            <ClusterHeader area="Williamsburg" count={12} />
            {nearbyFeed.map((scan) => (
              <ScanCard key={scan.id} scan={scan} />
            ))}
          </>
        )}

        {(active === "discover" || active === "following" || active === "saved") && (
          <EmptyDashboardState
            eyebrow="Your feed is quiet"
            title="Scan a song to start your feed."
            body="Every post here starts with a scan. Identify what's playing around you — or follow a few friends to see what they're catching."
            secondaryLabel="Find friends to follow"
            secondaryHref="/discover"
          />
        )}
      </div>

      <div className="hidden w-[340px] flex-shrink-0 lg:block">
        {active === "nearby" ? (
          <RailSection title="Tonight · nearby" linkLabel="Map view" items={nearbyTonight} />
        ) : (
          <>
            {!!rails?.recent.length && (
              <RailSection title="Recently scanned by you" linkLabel="View all" items={rails.recent} />
            )}
            {!!rails?.trending.length && (
              <RailSection title="Trending scans" linkLabel="More" items={rails.trending} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
