import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { UserDataSelect } from "@/lib/types";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import UserAvatar from './UserAvatar';
import { Button } from "./ui/button";
import { unstable_cache } from "next/cache";
import { formatNumber } from "@/lib/utils";

export default function TrendsSidebar() {
  return (
    <div className="sticky top-[5.25rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80">
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        <WhoToFollow />
        <TrendingTopics />
      </Suspense>
    </div>
  );
}

const WhoToFollow = async () => {
  const {user} = await validateRequest();

  if (!user) {
    return null;
  }


  const usersToFollow = await prisma.user.findMany({
    where: {
      NOT: {
        id: user.id!,
      },
    },
    select: UserDataSelect,
    take: 5,
  });


  return (
    <div className="h-fit w-full space-y-5 rounded-xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Who to follow</div>
      {usersToFollow.length === 0 ? (
        <div className="text-muted-foreground">No users to follow</div>
      ) : (
        usersToFollow.map((user) => (
          <div key={user.username} className="flex items-center gap-3 justify-between">
            <Link href={`/users/${user.username}`} className="flex items-center gap-5">
              <UserAvatar avatarUrl={user.avatarUrl}  />
              <div>
                <div className="line-clamp-1 break-all font-semibold hover:underline">{user.displayName}</div>
                <div className="text-muted-foreground line-clamp-1 break-all">@{user.username}</div>
              </div>
            </Link>
            <Button >Follow</Button>
          </div>
        ))
      )}
    </div>
  );
};

const getTrendingTopics = unstable_cache(
    async () => {
      const result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
              SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+', 'g'))) AS hashtag, COUNT(*) AS count
              FROM posts
              GROUP BY (hashtag)
              ORDER BY count DESC, hashtag ASC
              LIMIT 5
          `;
    console.log("Query Result:", result);
      return result.map((row) => ({
        hashtag: row.hashtag,
        count: Number(row.count),
      }));
    },
    ["trending_topics"],
    {
      revalidate: 3 * 60 * 60,
    },
  );

  async function TrendingTopics() {
    const trendingTopics = await getTrendingTopics();

    console.log(trendingTopics, "trendingTopics")
  
    return (
      <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
        <div className="text-xl font-bold">Trending topics</div>
        {
        trendingTopics.length === 0 ? (<div>No trending topics yet!</div>) :
        trendingTopics.map(({ hashtag, count }) => {
          const title = hashtag.split("#")[1];
  
          return (
            <Link key={title} href={`/hashtag/${title}`} className="block">
              <p
                className="line-clamp-1 break-all font-semibold hover:underline"
                title={hashtag}
              >
                {hashtag}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatNumber(count)} {count === 1 ? "post" : "posts"}
              </p>
            </Link>
          );
        })}
      </div>
    );
  }