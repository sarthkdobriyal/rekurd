import { validateRequest } from "@/auth";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";
import { Bookmark, BoomBox, Home, Plus, Radio, UserRound, UserRoundSearch } from "lucide-react";
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
        title="Add"
        asChild
      >
        <Link href="/post">
          <Plus />
          <span className="hidden lg:inline">Post</span>
        </Link>
      </Button>


      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Radio"
        asChild
      >
        <Link href="/radio">
          <BoomBox />
          <span className="hidden lg:inline">Radio</span>
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