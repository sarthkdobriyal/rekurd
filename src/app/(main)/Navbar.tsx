import UserButton from "@/components/UserButton";
import MessagesButton from "@/components/MessagesButton";
import Link from "next/link";
import { Search } from "lucide-react";
import NotificationsButton from "./NotificationsButton";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { BoltIcon } from "./_components/dashboard/icons";
import NavLinks from "./_components/dashboard/NavLinks";

export default async function Navbar() {
  const { user } = await validateRequest();

  if (!user) return null;

  const unreadNotificationsCount = await prisma.notification.count({
    where: {
      recipientId: user.id,
      read: false,
    },
  });

  return (
    <header className="sticky top-0 z-20 flex h-[58px] items-center border-b border-white/[0.07] bg-[#080808]/85 px-4 backdrop-blur-md sm:px-7">
      <Link href="/" className="flex flex-shrink-0 items-center gap-2">
        <BoltIcon className="h-[19px] w-[13px] text-[#e8623a]" />
        <span className="font-display text-[22px] italic leading-none text-white">
          outsound.
        </span>
      </Link>

      <NavLinks />

      <div className="ml-auto flex flex-shrink-0 items-center gap-2.5">
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/40" />
          <input
            placeholder="Search tracks, artists, users…"
            className="w-[220px] rounded-full border border-white/[0.07] bg-white/[0.04] py-1.5 pl-8 pr-3.5 text-xs text-white/52 outline-none transition-colors focus:border-[rgba(232,98,58,0.4)] focus:text-white"
          />
        </div>
        <MessagesButton initialState={{ unreadCount: 0 }} />
        <NotificationsButton
          initialState={{ unreadCount: unreadNotificationsCount }}
        />
        <UserButton className="h-[34px] w-[34px] border-[1.5px] border-white/[0.14]" />
      </div>
    </header>
  );
}
