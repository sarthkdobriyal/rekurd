import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import MenuBar from "./MenuBar";
import Navbar from "./Navbar";
import SessionProvider from "./SessionProvider";
import {
  BotMessageSquare,
  MessageCircle,
  MessageCircleCode,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import ChatBotAvatar from "@/components/ChatBotAvatar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  if (!session.user) redirect("/landing");


  return (
    <SessionProvider value={session}>
      <div className="relative flex h-screen min-h-screen flex-col ">
        <Navbar />
        <div className="mx-auto flex h-full w-full max-w-7xl gap-5 p-5">
          <MenuBar className="sticky top-[5.25rem] hidden h-fit flex-none space-y-3 rounded-2xl bg-card px-3 py-5 shadow-sm sm:block lg:px-5 xl:w-80" />
          {children}
        </div>
        <MenuBar className="fixed bottom-0 flex w-full justify-center gap-5 border-t bg-card p-3 sm:hidden" />
        <Link href='/ai-chatbot' >
          <ChatBotAvatar />
        </Link>
      </div>
    </SessionProvider>
  );
}
