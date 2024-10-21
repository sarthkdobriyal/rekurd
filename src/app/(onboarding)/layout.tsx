import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";

import {
  BotMessageSquare,
  MessageCircle,
  MessageCircleCode,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import ChatBotAvatar from "@/components/ChatBotAvatar";
import { WebSocketProvider } from "../providers/web-socket";
import SessionProvider from "../(main)/SessionProvider";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  if (!session.user) redirect("/landing");


  return (
    <SessionProvider value={session}>
        <div className="h-screen w-screen max-h-screen max-w-screen ">

          {children}
        </div>
    </SessionProvider>
  );
}
