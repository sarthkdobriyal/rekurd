"use client";

import useConnectionInfo from "@/hooks/useConnectionInfo";
import useFollowerInfo from "@/hooks/useFollowerInfo";
import { ConnectionInfo } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";

interface ConnectionCountProps {
  userId: string;
  username: string;
  initialState: ConnectionInfo;
}

export default function ConnectionCount({
  userId,
  username,
  initialState,
}: FollowerCountProps) {
  const { data } = useConnectionInfo(userId, initialState);

  return (
    <Link href={`/users/${username}/connections`}>
    <span className="flex flex-col items-center">
      <span className="font-semibold text-2xl">{formatNumber(data.connections)}</span>
      Jammers
    </span>
    </Link>
  );
}