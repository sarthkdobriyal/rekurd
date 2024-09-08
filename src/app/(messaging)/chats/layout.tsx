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
import SessionProvider from "@/app/(main)/SessionProvider";

import MenuBar from "@/app/(main)/MenuBar";
import Navbar from "./_components/Navbar";
import { WebSocketProvider } from "@/app/providers/web-socket";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  if (!session.user) redirect("/landing");


  return (
    <SessionProvider value={session}>
      <WebSocketProvider>
      <div className="relative flex h-full max-h-full  flex-col ">
        {/* <Navbar /> */}
        <div className="mx-auto flex h-full w-full max-w-5xl gap-5">
          {children}
        </div>
        {/* <MenuBar className="fixed bottom-0 flex w-full justify-center gap-5 border-t bg-card p-3 sm:hidden" /> */}
      </div>
      </WebSocketProvider>
    </SessionProvider>
  );
}
