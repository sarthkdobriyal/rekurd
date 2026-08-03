"use client";

import ConnectionButton from "@/components/ConnectionButton";
import ViewConversation from "@/components/ViewConversation";
import useConnectionInfo from "@/hooks/useConnectionInfo";
import { ConnectionInfo } from "@/lib/types";

interface ProfileConnectionActionsProps {
  userId: string;
  initialState: ConnectionInfo;
}

// Message button + JAM button share the live ["connection-info", userId] cache,
// so accepting a request reveals the message button without a reload.
export default function ProfileConnectionActions({
  userId,
  initialState,
}: ProfileConnectionActionsProps) {
  const { data } = useConnectionInfo(userId, initialState);

  return (
    <>
      {data.isUserConnected && <ViewConversation externalUserId={userId} />}
      <ConnectionButton userId={userId} initialState={initialState} />
    </>
  );
}
