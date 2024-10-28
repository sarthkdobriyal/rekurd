import { validateRequest } from "@/auth";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";
import { Bookmark, Home, UserRound, UserRoundSearch } from "lucide-react";
import Link from "next/link";



interface MenuBarProps {
  className?: string;
}

export default async function MenuBar({ className }: MenuBarProps) {
  const { user } = await validateRequest();

  if (!user) return null;



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

      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Discover"
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
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="profile"
        asChild
      >
        <Link href={`/users/${user.username}`}>
          <UserAvatar avatarUrl={user.avatarUrl} size={32} />
          <span className="hidden lg:inline">Profile</span>
        </Link>
      </Button>
    </div>
  );
}