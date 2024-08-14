import { validateRequest } from "@/auth";
import ConnectionButton from "@/components/ConnectionButton";
import FollowButton from "@/components/FollowButton";
import UserAvatar from "@/components/UserAvatar";
import UserTooltip from "@/components/UserTooltip";
import prisma from "@/lib/prisma";
import { getUserDataSelect, UserData } from "@/lib/types";
import Link from "next/link";

interface ConnectionsProps {
    user: UserData 
}

export default async function Connections({user}) {

    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) return {};


  const connections = user.sentConnections.concat(user.receivedConnections).filter((conn) => conn.status === 'CONNECTED')

    return <div className="w-full">
       <div className="space-y-5 rounded-2xl  p-5 shadow-sm">
      {
      !connections.length ? <div>No users to follow</div> :
      
      connections.map((conn) => 
      {
        const connUser = conn.requester.id === user.id ? conn.recipient : conn.requester;
      
      return (
        <div key={connUser.id} className="flex hover:bg-card px-3 py-2 rounded-xl items-center justify-between gap-3">
          {/* <UserTooltip user={user}> */}
            <Link
              href={`/users/${connUser.username}`}
              className="flex items-center gap-3"
            >
              <UserAvatar avatarUrl={connUser.avatarUrl} className="flex-none" />
              <div>
                <p className="line-clamp-1 break-all font-semibold hover:underline">
                  {connUser.displayName}
                </p>
                <p className="line-clamp-1 break-all text-muted-foreground">
                  @{connUser.username}
                </p>
              </div>
            </Link>
          {/* </UserTooltip> */}
          
        </div>
      )
    }
      )}
    </div>
    </div>
}