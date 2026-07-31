import { validateRequest } from "@/auth";
import UserAvatar from "@/components/UserAvatar";
import { cn } from "@/lib/utils";
import { Home, Search } from "lucide-react";
import Link from "next/link";
import { BoltIcon } from "./_components/dashboard/icons";

interface MenuBarProps {
  className?: string;
}

export default async function MenuBar({ className }: MenuBarProps) {
  const { user } = await validateRequest();

  if (!user) return null;

  const items = [
    { href: "/", label: "Feed", icon: Home },
    { href: "/discover", label: "Discover", icon: Search },
    { href: "/scan", label: "Scan", icon: BoltIcon, accent: true },
  ];

  return (
    <div className={className}>
      {items.map(({ href, label, icon: Icon, accent }) => (
        <Link
          key={href}
          href={href}
          className="flex flex-1 flex-col items-center gap-1 py-1"
        >
          <span
            className={cn(
              "flex h-5 w-5 items-center justify-center",
              accent ? "text-[#e8623a]" : "text-white/26",
            )}
          >
            <Icon className={accent ? "h-[18px] w-[13px]" : "h-5 w-5"} />
          </span>
          <span
            className={cn(
              "text-[9.5px] font-medium",
              accent ? "text-[#e8623a]" : "text-white/26",
            )}
          >
            {label}
          </span>
        </Link>
      ))}
      <Link
        href={`/users/${user.username}`}
        className="flex flex-1 flex-col items-center gap-1 py-1"
      >
        <UserAvatar avatarUrl={user.avatarUrl} size={20} />
        <span className="text-[9.5px] font-medium text-white/26">Profile</span>
      </Link>
    </div>
  );
}
