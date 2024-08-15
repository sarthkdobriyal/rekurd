import { validateRequest } from "@/auth";
import ConnectionButton from "@/components/ConnectionButton";
import UserAvatar from "@/components/UserAvatar";
import UserTooltip from "@/components/UserTooltip";
import prisma from "@/lib/prisma";
import { getUserDataSelect, UserData } from "@/lib/types";
import Link from "next/link";

interface ConnectionsProps {
    user: UserData ,
}

export default  function Connections({user}: ConnectionsProps) {




    const sentConnections = user.sentConnections.filter((conn) => conn.status === 'CONNECTED');
    const receivedConnections = user.receivedConnections.filter((conn) => conn.status === 'CONNECTED');
    const connections = [...sentConnections, ...receivedConnections];
       console.log(connections)

    return <div className="w-full">
       <div className="space-y-5 rounded-2xl  p-5 shadow-sm">
      {
      !connections.length ? <div>No users to follow</div> :
      
      connections.map((conn) => 
      {
        const connUser = 'requester' in conn ? conn.requester : conn.recipient;
      return (
        <div key={connUser.id} className="flex hover:bg-card px-3 py-2 rounded-xl items-center justify-between gap-3">
          {/* <UserTooltip user={user}> */}
            <Link
              href={`/users/${connUser?.username}`}
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