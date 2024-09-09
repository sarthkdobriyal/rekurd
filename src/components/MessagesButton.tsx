"use client";

import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Mail, MessageCircle } from "lucide-react";
import Link from "next/link";

interface MessagesButtonProps {
  initialState: {
    unreadCount: number
  };
}

export default function MessagesButton({ initialState }: MessagesButtonProps) {



    const data = initialState;
  return (
    <Button
      variant="ghost"
      className="flex items-center justify-start gap-3"
      title="Messages"
      asChild
    >
      <Link href="/chats">
        <div className="relative">
        <MessageCircle />
          {!!data.unreadCount && (
            <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1 text-xs font-medium tabular-nums text-primary-foreground">
              {data.unreadCount}
            </span>
          )}
        </div>
        <span className="hidden lg:inline">Messages</span>
      </Link>
    </Button>
  );
}