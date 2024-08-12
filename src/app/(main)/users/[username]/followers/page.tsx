import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Followers from "./Followers";
import { cache } from "react";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { UserProfile } from "../page";
import { get } from "http";
import { getUserDataSelect } from "@/lib/types";
import TrendsSidebar from "@/components/TrendsSidebar";

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



export default async function FollowersPage({ params: { username } }: PageProps) {
   
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) return {};
  
    const user = await getUser(username, loggedInUser.id);
    console.log(user)
  return (
    <div className="flex w-full gap-5">
    <div className="w-full flex flex-col gap-3">
        <UserProfile user={user} loggedInUserId={loggedInUser.id} />
      <Tabs defaultValue="follows-you">
          <TabsList>
            <TabsTrigger value="follows-you">Followers</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
          <TabsContent value="follows-you">
            <Followers userId={user.id} />
          </TabsContent>
          <TabsContent value="following">
            following
          </TabsContent>
        </Tabs>
    </div>
    <TrendsSidebar />
    </div>
  );
}