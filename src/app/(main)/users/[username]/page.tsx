import { validateRequest } from "@/auth";
import FollowButton from "@/components/FollowButton";
import FollowerCount from "@/components/FollowerCount";
import UserAvatar from "@/components/UserAvatar";
import prisma from "@/lib/prisma";
import { FollowerInfo, getUserDataSelect, UserData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { formatDate } from "date-fns";
import { notFound } from "next/navigation";
import { cache } from "react";
import EditProfileButton from "./EditProfileButton";
import TrendsSidebar from "@/components/TrendsSidebar";
import { User } from "lucide-react";
import UserPosts from "./UserPosts";
import { Metadata } from "next";
import { get } from "http";
import Linkify from "@/components/Linkify";
import Link from "next/link";

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
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <UserProfile user={user} loggedInUserId={loggedInUser.id} />
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h2 className="text-center text-2xl font-bold">
            {user.displayName}&apos;s posts
          </h2>
        </div>
        <UserPosts userId={user.id} />
      </div>
      <TrendsSidebar />
    </main>
  );
}
interface UserProfileProps {
  user: UserData;
  loggedInUserId: string;
}

async function UserProfile({ user, loggedInUserId }: UserProfileProps) {
  const followerInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      ({ followerId }) => followerId === loggedInUserId,
    ),
  };

  console.log(user);

  return (
    <div className="h-fit w-full space-y-5 rounded-2xl bg-card px-5 py-5 shadow-sm">
      <div className="flex items-center justify-between">
        <UserAvatar
          avatarUrl={user.avatarUrl}
          size={150}
          className="max-h-60 max-w-60 rounded-full"
        />

        <div className="flex w-full flex-col flex-wrap justify-center gap-3 pl-5 sm:flex-nowrap">
          <div className="space-y-2">
            <div className="flex w-full">
              <div className="flex flex-1 justify-center">
                <span className="flex flex-col items-center">
                  <span className="text-2xl font-semibold">
                    {formatNumber(user._count.posts)}
                  </span>
                  Posts
                </span>
              </div>
              <div className="flex flex-1 justify-center">
                <FollowerCount userId={user.id} initialState={followerInfo} />
              </div>
            </div>

            <div className="flex flex-col xl:pl-10">
              <h1 className="text-3xl font-bold">{user.displayName}</h1>
              <div className="text-muted-foreground">@{user.username}</div>
              <div>
                Member since {formatDate(user.createdAt, "MMM d, yyyy")}
              </div>
            </div>
          </div>

          {user.id === loggedInUserId ? (
            <EditProfileButton user={user} />
          ) : (
            <FollowButton userId={user.id} initialState={followerInfo} />
          )}
        </div>
      </div>

      {user.musicalInfo && (
        <section className="w-full">
          {/* <h2 className="mb-4 text-2xl font-bold text-secondary-foreground">
            Soundscape Story
            </h2> */}
          <p className="mb-2 text-3xl font-bold italic tracking-widest">
            {user.musicalInfo.title}
          </p>
          <p className="mb-2 text-lg italic">
            🎶{" "}
            <span className="text-sm font-semibold tracking-tighter text-muted-foreground">
              Experience:
            </span>{" "}
            {user.musicalInfo.yearsOfExperience} Years of{" "}
            {user.musicalInfo.genres} Mastery
          </p>
          <p className="mb-2 text-lg italic">
            🎷{" "}
            <span className="text-sm font-semibold tracking-tighter text-muted-foreground">
              Primary Instrument:
            </span>{" "}
            {user.musicalInfo.primaryInstrument}
          </p>
          {user.musicalInfo.instruments && (
            <p className="mb-2 text-lg italic">
              🥁{" "}
              <span className="text-sm font-semibold tracking-tighter text-muted-foreground">
                Other Instruments:
              </span>{" "}
              {user.musicalInfo.instruments}
            </p>
          )}
          <p className="mb-2 text-lg italic">
            🎼{" "}
            <span className="text-sm font-semibold tracking-tighter text-muted-foreground">
              Genres:
            </span>{" "}
            {user.musicalInfo.genres}
          </p>
          <div className="mb-4 text-lg italic">
            🎤{" "}
            <span className="text-sm font-semibold tracking-tighter text-muted-foreground">
              Musical Journey:
            </span>
            <Linkify>
              <p className="flex flex-wrap overflow-hidden whitespace-pre-line break-words px-4">
                {user.musicalInfo.bio}
              </p>
            </Linkify>
          </div>
          {user.musicalInfo.interestedInLearning && (
            <p className="mb-2 text-lg italic text-green-600">
              📚 Available to jam and learn from fellow musicians
            </p>
          )}
          {user.musicalInfo.interestedInTutoring ? (
            <p className="mb-2 text-lg italic text-blue-600">
              📢 Available to share the groove with others
            </p>
          ) : (
            <></>
          )}
        </section>
      )}

      {user.bio && (
        <>
          <hr />
          <Linkify>
            <div className="overflow-hidden whitespace-pre-line break-words">
              {user.bio}
            </div>
          </Linkify>
        </>
      )}
    </div>
  );
}
