"use client";

import { useState } from "react";
import ClusterHeader from "./ClusterHeader";
import EmptyDashboardState from "./EmptyDashboardState";
import FilterPills from "./FilterPills";
import QuickScanBar from "./QuickScanBar";
import { RailSection } from "./RightRail";
import ScanCard from "./ScanCard";
import {
  FilterKey,
  friendsFeed,
  nearbyFeed,
  nearbyTonight,
  recentlyScanned,
  trendingScans,
} from "./mock-data";

export default function DashboardFeed() {
  const [active, setActive] = useState<FilterKey>("friends");

  return (
    <div className="mx-auto flex w-full max-w-[1080px] gap-7 px-4 pb-16 pt-6 sm:px-7">
      <div className="min-w-0 flex-1 sm:max-w-[640px]">
        <QuickScanBar />
        <FilterPills active={active} onChange={setActive} />

        {active === "friends" &&
          friendsFeed.map((scan) => <ScanCard key={scan.id} scan={scan} />)}

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
            <RailSection title="Recently scanned by you" linkLabel="View all" items={recentlyScanned} />
            <RailSection title="Trending scans" linkLabel="More" items={trendingScans} />
          </>
        )}
      </div>
    </div>
  );
}
