"use client";

import useFollowerInfo from "@/hooks/useFollowerInfo";
import { FollowerInfo } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";

interface FollowerCountProps {
  userId: string;
  username: string;
  initialState: FollowerInfo;
}

export default function FollowerCount({
  userId,
  username,
  initialState,
}: FollowerCountProps) {
  const { data } = useFollowerInfo(userId, initialState);

  return (
    <Link href={`/users/${username}/followers`}>
    <span className="flex flex-col items-center">
      <span className="font-semibold text-2xl">{formatNumber(data.followers)}</span>
      Followers
    </span>
    </Link>
  );
}