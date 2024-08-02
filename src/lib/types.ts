import { Prisma } from "@prisma/client";
import { get } from "http";

export function getUserDataSelect(loggedInUserId: string) {
  return {
    username: true,
    displayName: true,
    avatarUrl: true,
  } satisfies Prisma.UserSelect;
}

export type UserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserDataSelect>;
}>;

export const UserDataSelect = getUserDataSelect("");

export function getPostDataInclude(loggedInUserId: string) {
  return {
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
   
  } satisfies Prisma.PostInclude;
}

export type PostData = Prisma.PostGetPayload<{
  include: ReturnType<typeof getPostDataInclude>;
}>;

export const postDataInclude = getPostDataInclude("");