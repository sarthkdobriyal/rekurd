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
import Onboarding from './onboarding/page';
import prisma from "@/lib/prisma";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  if (!session.user) redirect("/landing");


  const OnboardingStep = await prisma.user.findUnique({
    where: {
      id: session.user.id
    },
    select: {
      onboardingStep: true
    }
  })

  if(OnboardingStep?.onboardingStep === -1) redirect("/")


  return (
    <SessionProvider value={session}>
        <div className="h-screen w-screen max-h-screen max-w-screen ">

          {children}
        </div>
    </SessionProvider>
  );
}
