"use client"


import { validateRequest } from '@/auth';
import UserAvatar from '@/components/UserAvatar';
import UserTooltip from '@/components/UserTooltip';
import prisma from '@/lib/prisma';
import { DiscoverUsers, getUserDataSelect } from '@/lib/types';
import Link from 'next/link';
import React from 'react'
import { useSession } from '../SessionProvider';
import { useQuery } from '@tanstack/react-query';
import kyInstance from '@/lib/ky';
import ArtistCard from './_components/ArtistCard';
import ArtistsCardSkeleton from './_components/ArtistsCardSkeleton';

 function Artists() {

    const { user: loggedInUser } = useSession()

 

  // const discoverUsers = await prisma.user.findMany({
  //   where: {
  //     id: {
  //       not: loggedInUser.id,
  //     },
  //     AND: [
  //       {
  //         NOT: {
  //           sentConnections: {
  //             some: {
  //               recipientId: loggedInUser.id,
  //             },
  //           },
  //         },
  //       },
  //       {
  //         NOT: {
  //           receivedConnections: {
  //             some: {
  //               requesterId: loggedInUser.id,
  //             },
  //           },
  //         },
  //       },
  //     ],
  //   },
  //   select: getUserDataSelect(loggedInUser.id)
  // });
  const { data, isError, isLoading } = useQuery({
    queryKey: ["discover-users"],
    queryFn: () =>
      kyInstance
        .get("/api/find-nearby-users")
        .json<DiscoverUsers>(),
  });

  if (!loggedInUser) return null;

  if (isLoading) {
    return (
      <div className="w-full h-[80%] p-3 gap-x-3 flex overflow-x-scroll scroll-smooth snap-x snap-mandatory max-w-full  scrollbar-hide">
        {[...Array(5)].map((_, index) => (
          <ArtistsCardSkeleton key={index} />
        ))}
      </div>
    );
  }


  if(!data) {
    return <div>No users available</div>
  }

  const discoverUsers = data
  console.log(data)

  


  return (
    <div className="w-full h-[80%] p-3 gap-x-3 flex overflow-x-scroll scroll-smooth snap-x snap-mandatory max-w-full scrollbar-hide ">
      {
      !discoverUsers.length ? <div>No users to follow</div> :
      
      discoverUsers.map(({user}) => (
        <ArtistCard artist={user} key={user.id}/>
      ))}
    </div>
  )
}

export default Artists