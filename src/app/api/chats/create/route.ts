import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await req.json();

    if (!userId) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Create a new conversation
    const conversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [{ id: loggedInUser.id }, { id: userId }],
        },
      },
    });

    return Response.json({ conversationId: conversation.id }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}