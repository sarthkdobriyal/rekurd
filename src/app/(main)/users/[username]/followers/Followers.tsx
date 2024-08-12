import { validateRequest } from "@/auth";
import FollowButton from "@/components/FollowButton";
import UserAvatar from "@/components/UserAvatar";
import UserTooltip from "@/components/UserTooltip";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import Link from "next/link";

interface FollowersProps {
    userId: string 
}

export default async function Followers({userId}) {

    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) return {};



  const followers = await prisma.user.findMany({
    where: {
      followers: {
          some: {
              followingId: userId
          }
      },
    },
    select: getUserDataSelect(userId),
  });

  console.log(followers)



    return <div className="w-full">
       <div className="space-y-5 rounded-2xl  p-5 shadow-sm">
      {
      !followers.length ? <div>No users to follow</div> :
      
      followers.map((user) => (
        <div key={user.id} className="flex items-center justify-between gap-3">
          <UserTooltip user={user}>
            <Link
              href={`/users/${user.username}`}
              className="flex items-center gap-3"
            >
              <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
              <div>
                <p className="line-clamp-1 break-all font-semibold hover:underline">
                  {user.displayName}
                </p>
                <p className="line-clamp-1 break-all text-muted-foreground">
                  @{user.username}
                </p>
              </div>
            </Link>
          </UserTooltip>
          <FollowButton
            userId={user.id}
            initialState={{
              followers: user._count.followers,
              isFollowedByUser: user.followers.some(
                ({ followerId }) => followerId === user.id,
              ),
            }}
          />
        </div>
      ))}
    </div>
    </div>
}