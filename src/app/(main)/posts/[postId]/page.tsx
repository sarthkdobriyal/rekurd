import { validateRequest } from '@/auth';
import ConnectionButton from '@/components/ConnectionButton';
import Linkify from '@/components/Linkify';
import Post from '@/components/posts/Post';
import UserAvatar from '@/components/UserAvatar';
import UserTooltip from '@/components/UserTooltip';
import prisma from '@/lib/prisma';
import { ConnectionInfo, getPostDataInclude, UserData } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cache, FC, Suspense } from 'react'

interface PostDetailsPageProps {
    params: { postId: string };
}

const getPost = cache(async (postId: string, loggedInUserId: string) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: getPostDataInclude(loggedInUserId),
  });

  if (!post) notFound();

  return post;
});

export async function generateMetadata({
  params: { postId },
}: PostDetailsPageProps): Promise<Metadata> {
  const { user } = await validateRequest();

  if (!user) return {};

  const post = await getPost(postId, user.id);

  return {
    title: `${post.user.displayName}: ${post.content.slice(0, 50)}...`,
  };
}


const PostDetailsPage: FC<PostDetailsPageProps> = async ({params}) => {

  const { user } = await validateRequest();

  if (!user) {
    return (
      <p className="text-destructive">
        You&apos;re not authorized to view this page.
      </p>
    );
  }

  const post = await getPost(params.postId, user.id);


  return <main className="flex w-full min-w-0 gap-5">
  <div className="w-full min-w-0 space-y-5">
    <Post post={post} />
  </div>
  <div className="sticky top-[5.25rem] hidden h-fit w-80 flex-none lg:block">
    <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
      <UserInfoSidebar user={post.user} />
    </Suspense>
  </div>
</main>
}


interface UserInfoSidebarProps {
  user: UserData;
}

async function UserInfoSidebar({ user }: UserInfoSidebarProps) {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return null;

  const totalConnections = user.sentConnections.filter((conn) => conn.status === "CONNECTED").length + user.receivedConnections.filter((conn) => conn.status === "CONNECTED").length

  const connectionInfo: ConnectionInfo = {
    connections: totalConnections,
    isUserConnected: user.sentConnections.some((conn) => conn.status === "CONNECTED" && (conn.recipientId === loggedInUser.id)) ||
                 user.receivedConnections.some((conn) => conn.status === "CONNECTED" && (conn.requesterId === loggedInUser.id)),
    isConnectionPending:user.sentConnections.some(({ status, recipientId }) => status === "PENDING" && recipientId=== loggedInUser.id) ||
user.receivedConnections.some(({ status, requesterId }) => status === "PENDING" && requesterId === loggedInUser.id),
    isLoggedInUserSender: user.receivedConnections.some(({ requesterId, status }) => status === "PENDING" && requesterId === loggedInUser.id ),
    isLoggedInUserReciepient: user.sentConnections.some(({ recipientId, status }) => status === "PENDING" && recipientId === loggedInUser.id),
  }


  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">About this user</div>
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
      <Linkify>
        <div className="line-clamp-6 whitespace-pre-line break-words text-muted-foreground">
          {user.bio}
        </div>
      </Linkify>
      {user.id !== loggedInUser.id && (
        <ConnectionButton  userId={user.id} initialState={connectionInfo} />
      )}
    </div>
  );
}


export default PostDetailsPage