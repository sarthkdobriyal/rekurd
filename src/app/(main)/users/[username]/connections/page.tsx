import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Followers from "./Connections";
import { cache } from "react";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { UserProfile } from "../page";
import { get } from "http";
import { getUserDataSelect } from "@/lib/types";
import TrendsSidebar from "@/components/TrendsSidebar";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import Link from "next/link";
import Connections from "./Connections";

interface PageProps {
  params: { username: string };
}

const getUser = cache(async (username: string, loggedInUserId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: getUserDataSelect(loggedInUserId),
  });

  if (!user) notFound();

  return user;
});

export default async function FollowersPage({
  params: { username },
}: PageProps) {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return {};

  const user = await getUser(username, loggedInUser.id);
  return (
    <div className="flex w-full gap-5">
      <div className="flex w-full flex-col gap-3">
        {/* <UserProfile user={user} loggedInUserId={loggedInUser.id} /> */}
        <div className="flex bg-card  p-3 rounded-xl items-center gap-1">
          <Link href={`/users/${user?.username}`}>
            <ArrowLeft size={24} />
          </Link>
          <h1 className="">{user.displayName}&apos;s JAMers</h1>
          <p className="text-muted-foreground"></p>
        </div>
            {
              user.id === loggedInUser.id && <span className="ml-auto text-blue-400">View Requests</span>
            }
            <Connections user={user} />
      </div>
      <TrendsSidebar />
    </div>
  );
}
