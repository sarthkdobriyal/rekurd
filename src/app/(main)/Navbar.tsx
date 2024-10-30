import SearchField from "@/components/SearchField";
import UserButton from "@/components/UserButton";
import { User } from "lucide-react";
import Link from "next/link";
import NotificationsButton from "./NotificationsButton";
import MessagesButton from "@/components/MessagesButton";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { Logo } from "@/components/Logo";

export default async function Navbar() {

  const { user } = await validateRequest();

  if (!user) return null;


  const unreadNotificationsCount = await prisma.notification.count({
    where: {
      recipientId: user.id,
      read: false,
    },
  })
  return (
    <header className="sticky top-0 z-10 bg-black ">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 pl-5 py-2">
        <Logo />
        <div className="flex gap-2">
          {/* <SearchField /> */}

          <NotificationsButton
            initialState={{ unreadCount: unreadNotificationsCount }}
          />
          <MessagesButton initialState={{ unreadCount: 0 }} />
          
        </div>
      </div>
    </header>
  );
}
