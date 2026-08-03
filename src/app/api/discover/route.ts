import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect, type UserData } from "@/lib/types";

export interface DiscoverPage {
  users: UserData[];
}

// General musician discovery: everyone except yourself and anyone you're
// already tied to (any Connection row, either direction — PENDING or CONNECTED).
// Not geo-scoped; find-nearby-users stays the city-based variant.
export async function GET() {
  try {
    const { user: loggedInUser } = await validateRequest();
    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      where: {
        id: { not: loggedInUser.id },
        sentConnections: { none: { recipientId: loggedInUser.id } },
        receivedConnections: { none: { requesterId: loggedInUser.id } },
      },
      select: getUserDataSelect(loggedInUser.id),
      orderBy: { createdAt: "desc" },
      take: 40,
    });

    return Response.json({ users } satisfies DiscoverPage);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
