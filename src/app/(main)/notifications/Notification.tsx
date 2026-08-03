import UserAvatar from "@/components/UserAvatar";
import { NotificationData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { NotificationType } from "@prisma/client";
import { ArrowUpRight, Heart, MessageCircle, User2 } from "lucide-react";
import Link from "next/link";
import type { JSX } from "react";

interface NotificationProps {
  notification: NotificationData;
}

export default function Notification({ notification }: NotificationProps) {
  const notificationTypeMap: Record<
    NotificationType,
    { message: string; icon: JSX.Element; href: string }
  > = {
    FOLLOW: {
      message: "requested to jam with you.",
      icon: <User2 className="h-4 w-4 text-[#e8623a]" />,
      href: `/users/${notification.issuer.username}`,
    },
    COMMENT: {
      message: "commented on your post.",
      icon: <MessageCircle className="h-4 w-4 text-[#7c9ee8]" />,
      href: `/posts/${notification.postId}`,
    },
    LIKE: {
      message: "liked your post.",
      icon: <Heart className="h-4 w-4 fill-[#e05aa8] text-[#e05aa8]" />,
      href: `/posts/${notification.postId}`,
    },
    ACCEPT_CONNECTION: {
      message: "accepted your jam request.",
      icon: <User2 className="h-4 w-4 text-[#4ec26e]" />,
      href: `/users/${notification.issuer.username}`,
    },
  };

  const { message, icon, href } = notificationTypeMap[notification.type];

  return (
    <Link href={href} className="block">
      <article
        className={cn(
          "relative flex gap-3 rounded-2xl border border-white/[0.07] bg-[#0f0f0f] p-4 transition-colors hover:border-white/[0.14]",
          !notification.read &&
            "border-[#e8623a]/25 bg-[radial-gradient(circle_at_0%_0%,rgba(232,98,58,0.08),transparent_60%)]",
        )}
      >
        <div className="relative flex-shrink-0">
          <UserAvatar
            avatarUrl={notification.issuer.avatarUrl}
            size={40}
            className="h-10 w-10 rounded-full"
          />
          <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-white/[0.08] bg-[#0f0f0f]">
            {icon}
          </span>
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex flex-wrap items-baseline gap-1 break-words text-[13px] text-white/70">
            <span className="font-semibold text-white">
              {notification.issuer.displayName}
            </span>
            <span>{message}</span>
          </div>

          {notification.post && (
            <div className="mt-1.5 line-clamp-2 whitespace-pre-line text-[12.5px] text-white/40">
              {notification.post.content}
            </div>
          )}

          {(notification.type === NotificationType.FOLLOW ||
            notification.type === NotificationType.ACCEPT_CONNECTION) && (
            <span className="mt-2 flex items-center gap-1 text-[11px] font-medium text-[#e8623a]">
              Visit profile
              <ArrowUpRight size={13} />
            </span>
          )}
        </div>

        {!notification.read && (
          <span className="absolute right-4 top-4 h-2 w-2 flex-shrink-0 rounded-full bg-[#e8623a]" />
        )}
      </article>
    </Link>
  );
}
