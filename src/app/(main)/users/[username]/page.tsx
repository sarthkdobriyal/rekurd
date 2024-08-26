import { validateRequest } from "@/auth";
import UserAvatar from "@/components/UserAvatar";
import prisma from "@/lib/prisma";
import { ConnectionInfo, getUserDataSelect, UserData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { formatDate } from "date-fns";
import { notFound } from "next/navigation";
import { cache, lazy, Suspense } from "react";
import EditProfileButton from "./EditProfileButton";
import TrendsSidebar from "@/components/TrendsSidebar";
import { Loader2, User } from "lucide-react";

import { Metadata } from "next";
import { get } from "http";
import Linkify from "@/components/Linkify";
import Link from "next/link";
import { connect } from 'http2';
import ConnectionButton from "@/components/ConnectionButton";
import ConnectionCount from "@/components/ConnectionCount";
import UserProfile from "./UserProfile";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";

interface PageProps {
  params: { username: string };
}

const UserPosts = lazy(() => import('./UserPosts'));

const getUser = cache(async (username: string, loggedInUserId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: getUserDataSelect(loggedInUserId, true),
  });

  if (!user) notFound();

  return user;
});

export async function generateMetadata({
  params: { username },
}: PageProps): Promise<Metadata> {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return {};

  const user = await getUser(username, loggedInUser.id);

  return {
    title: `${user.displayName} (@${user.username})`,
  };
}

export default async function Page({ params: { username } }: PageProps) {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) {
    return (
      <p className="text-destructive">
        You&apos;re not authorized to view this page.
      </p>
    );
  }

  const user = await getUser(username, loggedInUser.id);

  return (
    <main className="flex w-full min-w-0 gap-5 h-fit pb-16">
      <div className="w-full min-w-0 space-y-5">
        <UserProfile user={user} loggedInUserId={loggedInUser.id} />
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h2 className="text-center text-2xl font-bold">
            {user.displayName}&apos;s posts
          </h2>
        </div>
        <Suspense fallback={<PostsLoadingSkeleton />}>
        <UserPosts userId={user.id} />
      </Suspense>
      </div>
      <TrendsSidebar />
    </main>
  );
}
