import Artists from "./Artists";
import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";

function page() {
  return (
    <main className="mx-auto flex w-full max-w-[1080px] flex-col">
      <div className="px-4 pt-6 sm:px-7">
        <h1 className="font-display text-[28px] italic leading-tight text-white">
          Discover musicians
        </h1>
        <p className="mt-0.5 text-[13px] text-white/52">
          Find artists to JAM with and fill your feed.
        </p>

        <div className="mt-4 flex items-center gap-3">
          <Link href="/search" className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.04] px-3.5 py-2.5 text-[13px] text-white/40 transition-colors hover:border-white/[0.14]">
              <Search className="h-4 w-4" />
              Search artists
            </div>
          </Link>
          <button
            aria-label="Filters"
            className="flex h-[42px] w-[42px] flex-shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.04] text-white/52 transition-colors hover:border-white/[0.14] hover:text-white"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Artists />
    </main>
  );
}

export default page;
