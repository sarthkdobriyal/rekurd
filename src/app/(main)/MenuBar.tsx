import { validateRequest } from "@/auth";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { Bookmark, Home, UserRoundSearch } from "lucide-react";
import Link from "next/link";
import MessagesButton from "../../components/MessagesButton";
import NotificationsButton from "./NotificationsButton";


interface MenuBarProps {
  className?: string;
}

export default async function MenuBar({ className }: MenuBarProps) {
  const { user } = await validateRequest();

  if (!user) return null;


  const unreadNotificationsCount = await prisma.notification.count({
    where: {
      recipientId: user.id,
      read: false,
    },
  })

  const unreadMessagesCount = 2
  return (
    <div className={className}>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Home"
        asChild
      >
        <Link href="/">
          <Home />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>
      <NotificationsButton
        initialState={{ unreadCount: unreadNotificationsCount }}
      />
      {/* <MessagesButton initialState={{ unreadCount: unreadMessagesCount }} /> */}

      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Bookmarks"
        asChild
      >
        <Link href="/discover">
          <UserRoundSearch />
          <span className="hidden lg:inline">Discover</span>
        </Link>
      </Button>

      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Bookmarks"
        asChild
      >
        <Link href="/bookmarks">
          <Bookmark />
          <span className="hidden lg:inline">Bookmarks</span>
        </Link>
      </Button>
    </div>
  );
}