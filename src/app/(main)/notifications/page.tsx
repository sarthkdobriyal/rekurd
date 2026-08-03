import TrendsSidebar from "@/components/TrendsSidebar";
import { Metadata } from "next";
import Notifications from "./Notifications";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Notifications",
};

export default function Page() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-4">
        <div className="flex items-center gap-3 px-1 pt-1">
          <Link
            href="/"
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/52 transition-colors hover:bg-white/[0.04] hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-display text-[22px] italic text-white">
            Notifications
          </h1>
        </div>
        <Notifications />
      </div>
      <TrendsSidebar />
    </main>
  );
}
