"use client";

import { MessageCircle } from "lucide-react";
import Link from "next/link";

interface MessagesButtonProps {
  initialState: {
    unreadCount: number;
  };
}

export default function MessagesButton({ initialState }: MessagesButtonProps) {
  const data = initialState;

  return (
    <Link
      href="/chats"
      title="Messages"
      className="relative flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full border border-white/[0.07] bg-white/[0.04] text-white/52 transition-colors hover:bg-white/[0.08] hover:text-white"
    >
      <MessageCircle className="h-[15px] w-[15px]" />
      {!!data.unreadCount && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full border-[1.5px] border-black bg-[#e8623a] px-1 text-[9px] font-semibold tabular-nums text-white">
          {data.unreadCount}
        </span>
      )}
    </Link>
  );
}