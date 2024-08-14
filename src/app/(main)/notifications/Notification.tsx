import UserAvatar from "@/components/UserAvatar";
import { NotificationData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { NotificationType } from "@prisma/client";
import { ArrowUpRight, Heart, MessageCircle, User2 } from "lucide-react";
import Link from "next/link";
import AcceptJamRequestButton from "./AcceptJamRequestButton";
import useConnectionInfo from "@/hooks/useConnectionInfo";
import { cache } from "react";
import { validateRequest } from "@/auth";
import { useSession } from "../SessionProvider";
import prisma from "@/lib/prisma";

interface NotificationProps {
  notification: NotificationData;
}



export default async function Notification({ notification }: NotificationProps) {
  const notificationTypeMap: Record<
    NotificationType,
    { message: string; icon: JSX.Element; href: string }
  > = {
    FOLLOW: {
      message: `has requested to jam with you.`,
      icon: <User2 className="size-7 text-primary" />,
      href: `/users/${notification.issuer.username}`,
    },
    COMMENT: {
      message: ` commented on your post`,
      icon: <MessageCircle className="size-7 fill-primary text-primary" />,
      href: `/posts/${notification.postId}`,
    },
    LIKE: {
      message: ` liked your post`,
      icon: <Heart className="size-7 fill-red-500 text-red-500" />,
      href: `/posts/${notification.postId}`,
    },
    ACCEPT_CONNECTION : {
      message: `accepted your connection request`,
      icon: <User2 className="size-7 text-primary" />,
      href: `/users/${notification.issuer.username}`,
    }
  };



  const { message, icon, href } = notificationTypeMap[notification.type];

 

  return (
    <Link href={href} className="block">
      <article
        className={cn(
          "flex gap-3 rounded-2xl bg-card p-5 shadow-sm transition-colors hover:bg-card/70 relative",
          !notification.read && "bg-primary/10",
        )}
      >
        <div className="my-1">{icon}</div>
        <div className="space-y-3 ">
          <UserAvatar avatarUrl={notification.issuer.avatarUrl} size={36} />
          <div className="flex gap-1">
            <span className="font-bold">{notification.issuer.displayName}</span>{" "}
            <span>{message}</span>
          </div>
          {
              notification.type === NotificationType.FOLLOW && (
                <span className=" flex gap-1 hover:border-b text-muted-foreground font-light text-xs tracking-tight absolute right-3 top-0">
                  Visit profile 
                  <ArrowUpRight size={15}/>
                </span>
              )
            }
          {notification.post && (
            <div className="line-clamp-3 whitespace-pre-line text-muted-foreground">
              {notification.post.content}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
