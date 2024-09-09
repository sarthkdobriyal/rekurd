import { Message, Prisma } from "@prisma/client";
import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";

export function getUserDataSelect(
  loggedInUserId: string,
  includeUserContact: boolean = false,
) {
  return {
    id: true,
    username: true,
    displayName: true,
    avatarUrl: true,
    bio: true,
    createdAt: true,
    followers: {
      where: {
        followingId: loggedInUserId,
      },
      select: {
        followerId: true,
      },
    },
    sentConnections: {
      select: {
        id: true,
        recipientId: true,
        status: true,
        recipient: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    },
    receivedConnections: {
      select: {
        id: true,
        requesterId: true,
        status: true,
        requester: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    },
    _count: {
      select: {
        posts: true,
        sentConnections: true,
        receivedConnections: true,
      },
    },
    musicalInfo: {
      select: {
        yearsOfExperience: true,
        title: true,
        genres: true,
        instruments: true,
        bio: true,
        interestedInTutoring: true,
        interestedInLearning: true,
        primaryInstrument: true,
      },
    },
    ...(includeUserContact && {
      email: true,
      UserContact: {
        select: {
          phone: true,
          city: true,
          country: true,
          socialLinks: true,
        },
      },
    }),
  } satisfies Prisma.UserSelect;
}
export type UserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserDataSelect>;
}>;

export function getPostDataInclude(loggedInUserId: string) {
  return {
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
    attachments: true,
    likes: {
      where: {
        userId: loggedInUserId,
      },
      select: {
        userId: true,
      },
    },
    bookmarks: {
      where: {
        userId: loggedInUserId,
      },
      select: {
        userId: true,
      },
    },
    _count: {
      select: {
        likes: true,
        comments: true,
      },
    },
  } satisfies Prisma.PostInclude;
}

export type PostData = Prisma.PostGetPayload<{
  include: ReturnType<typeof getPostDataInclude>;
}>;

export const postDataInclude = getPostDataInclude("");

export interface PostsPage {
  posts: PostData[];
  nextCursor: string | null;
}
export interface MessagePage {
  messages: Message[];
  nextCursor: string | null;
}

export interface ConnectionInfo {
  connections: number;
  isUserConnected: boolean;
  isConnectionPending: boolean;
  isLoggedInUserSender: boolean;
  isLoggedInUserReciepient: boolean;
}

export interface BookmarkInfo {
  isBookmarkedByUser: boolean;
}

export function getCommentDataInclude(loggedInUserId: string) {
  return {
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
  } satisfies Prisma.CommentInclude;
}

export type CommentData = Prisma.CommentGetPayload<{
  include: ReturnType<typeof getCommentDataInclude>;
}>;

export interface CommentsPage {
  comments: CommentData[];
  previousCursor: string | null;
}

export const notificationsInclude = {
  issuer: {
    select: {
      username: true,
      displayName: true,
      avatarUrl: true,
    },
  },
  post: {
    select: {
      content: true,
    },
  },
} satisfies Prisma.NotificationInclude;

export type NotificationData = Prisma.NotificationGetPayload<{
  include: typeof notificationsInclude;
}>;

export interface LikeInfo {
  likes: number;
  isLikedByUser: boolean;
}

export interface NotificationsPage {
  notifications: NotificationData[];
  nextCursor: string | null;
}

export interface NotificationCountInfo {
  unreadCount: number;
}

export interface MessageCountInfo {
  unreadCount: number;
}

export type SockerIoApiResponse = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};
