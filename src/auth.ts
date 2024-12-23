import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Google } from "arctic";
import { Lucia, Session, User } from "lucia";
import { cookies } from "next/headers";
import { cache } from "react";
import prisma from "./lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      // attributes has the type of DatabaseUserAttributes

      username: attributes.username,
      id: attributes.id,
      displayName: attributes.displayName,
      avatarUrl: attributes.avatarUrl,
      googleId: attributes.googleId,
    };
  },
});

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID as string,
  process.env.GOOGLE_CLIENT_SECRET as string,
  `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/google`,
);

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  username: string;
  id: string;
  displayName: string;
  avatarUrl: string | null;
  googleId: string | null;
}

export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId);

    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
    } catch {}

    return result;
  },
);

export const validateRequestForPages = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<
  { user: User; session: Session } | { user: null; session: null }
> => {
  const sessionId = req.cookies[lucia.sessionCookieName] ?? null;

  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  const result = await lucia.validateSession(sessionId);

  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      res.setHeader(
        "Set-Cookie",
        `${sessionCookie.name}=${sessionCookie.value}; ${Object.entries(
          sessionCookie.attributes,
        )
          .map(([key, value]) => `${key}=${value}`)
          .join("; ")}`,
      );
    }
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      res.setHeader(
        "Set-Cookie",
        `${sessionCookie.name}=${sessionCookie.value}; ${Object.entries(
          sessionCookie.attributes,
        )
          .map(([key, value]) => `${key}=${value}`)
          .join("; ")}`,
      );
    }
  } catch {}

  return result;
};
