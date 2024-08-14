"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { FollowerInfo, UserData } from "@/lib/types";
import Link from "next/link";
import { PropsWithChildren } from "react";
import FollowButton from "./FollowButton";
import FollowerCount from "./FollowerCount";
import Linkify from "./Linkify";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import UserAvatar from "./UserAvatar";
import ConnectionCount from "./ConnectionCount";
import ConnectionButton from "./ConnectionButton";
import { formatNumber } from "@/lib/utils";

interface UserTooltipProps extends PropsWithChildren {
  user: UserData;
}

export default function UserTooltip({ children, user }: UserTooltipProps) {
  const { user: loggedInUser } = useSession();


  const connectionInfo: ConnectionInfo = {
    connections: user.sentConnections.concat(user.receivedConnections).reduce((count, conn) => conn.status === "CONNECTED" ? count + 1 : count, 0),
    isUserConnected: user.sentConnections.concat(user.receivedConnections).some((conn) => conn.status === "CONNECTED" && (conn.recipientId === loggedInUser.id || conn.requesterId === loggedInUser.id)),
    isConnectionPending: user.sentConnections.concat(user.receivedConnections).some(({ status }) => status === "PENDING"),
    isLoggedInUserSender: user.receivedConnections.some(({ requesterId, status }) => status === "PENDING" && requesterId === loggedInUser.id ),
    isLoggedInUserReciepient: user.sentConnections.some(({ recipientId, status }) => status === "PENDING" && recipientId === loggedInUser.id),
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <div className="flex max-w-80 flex-col gap-3 break-words px-1 py-2.5 md:min-w-52">
            <div className="flex items-center justify-between gap-2">
              <Link href={`/users/${user.username}`}>
                <UserAvatar size={70} avatarUrl={user.avatarUrl} />
              </Link>
              {loggedInUser.id !== user.id && (
                <ConnectionButton userId={user.id} initialState={connectionInfo} />
              )}
            </div>
            <div>
              <Link href={`/users/${user.username}`}>
                <div className="text-lg font-semibold hover:underline">
                  {user.displayName}
                </div>
                <div className="text-muted-foreground">@{user.username}</div>
              </Link>
            </div>
            {user.bio && (
              <Linkify>
                <div className="line-clamp-4 whitespace-pre-line">
                  {user.bio}
                </div>
              </Linkify>
            )}
            <div className="flex w-full">
              <div className="flex flex-1 justify-center">
                <span className="flex flex-col items-center">
                  <span className="text-2xl font-semibold">
                    {formatNumber(user._count.posts)}
                  </span>
                  Posts
                </span>
              </div>
              <div className="flex flex-1 justify-center">
                <ConnectionCount userId={user.id} username={user.username} initialState={connectionInfo} />
                {/* <FollowerCount userId={user.id} username={user.username} initialState={followerInfo} /> */}
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}