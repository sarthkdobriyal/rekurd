import { validateRequest } from '@/auth';
import UserAvatar from '@/components/UserAvatar';
import UserTooltip from '@/components/UserTooltip';
import prisma from '@/lib/prisma';
import { getUserDataSelect } from '@/lib/types';
import Link from 'next/link';
import React from 'react'

async function Artists() {

    const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return null;

  const discoverUsers = await prisma.user.findMany({
    where: {
      id: {
        not: loggedInUser.id,
      },
      AND: [
        {
          NOT: {
            sentConnections: {
              some: {
                recipientId: loggedInUser.id,
              },
            },
          },
        },
        {
          NOT: {
            receivedConnections: {
              some: {
                requesterId: loggedInUser.id,
              },
            },
          },
        },
      ],
    },
    select: getUserDataSelect(loggedInUser.id)
  });

  


  return (
    <div className="space-y-5  shadow-sm">
      {
      !discoverUsers.length ? <div>No users to follow</div> :
      
      discoverUsers.map((user) => (
        <div key={user.id} className="flex items-center justify-between gap-3 hover:bg-card  px-5 py-3 rounded-lg">
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
          
        </div>
      ))}
    </div>
  )
}

export default Artists