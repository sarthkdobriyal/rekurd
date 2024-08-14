"use server";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { FollowerInfo } from "@/lib/types";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();
    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = params;

    const connection = await prisma.connection.findUnique({
      where: {
        OR: [
          {
            requesterId: loggedInUser.id,
            recipientId: userId,
          },
          {
            requesterId: userId,
            recipientId: loggedInUser.id,
          },
        ],
      },
    });

    console.log("connection", connection)

    const totalConnections = await prisma.connection.count({
      where: {
        OR: [
          {
            recipientId: userId,
            status: "CONNECTED",
          },
          {
            requesterId: userId,
            status: "CONNECTED",
          }
        ]
      },
    });

    console.log("connec", totalConnections)


    const data: ConnectionInfo = {
      connections: totalConnections,
      isUserConnected: connection  && connection.status === 'CONNECTED',
      isConnectionPending: connection && connection.status === 'PENDING',
      isLoggedInUserSender: connection && connection.status === 'PENDING' && connection.recipientId === loggedInUser.id,
      isLoggedInUserReciepient: connection && connection.status === 'PENDING' &&  connection.requesterId === loggedInUser.id
    };
    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params: { userId } }: { params: { userId: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();
    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (loggedInUser.id === userId) {
      return Response.json({ error: "Not Allowed" }, { status: 400 });
    }

    const existingConnection = await prisma.connection.findFirst({
      where: {
        OR: [
          {
            requesterId: loggedInUser.id,
            recipientId: userId,
          },
          {
            requesterId: userId,
            recipientId: loggedInUser.id,
          },
        ],
      },
    });

    if (existingConnection) {
      return Response.json({ error :  "Connection already exists"}, { status: 400 });
    }


    await prisma.$transaction([
      prisma.connection.create({
        data: {
          requesterId: loggedInUser.id,
          recipientId: userId,
          status: "PENDING",
        },
      }),
      prisma.notification.create({
        data: {
          issuerId: loggedInUser.id,
          recipientId: userId,
          type: "FOLLOW",
        },
      }),
    ]);

    return new Response();
  } catch (e) {
    console.log(e);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { followerId: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();
    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { followerId } = params;

    const connection = await prisma.connection.findFirst({
      where: {
        OR: [
          {
            requesterId: loggedInUser.id,
            recipientId: followerId,
          },
          {
            requesterId: followerId,
            recipientId: loggedInUser.id,
          },
        ],
      },
    })

    if (!connection) {
      return Response.json({ error: "Connection not found" }, { status: 404 });
    }



    const deleteResult = await prisma.$transaction([
      prisma.connection.deleteMany({
      where: {
        OR: [
        {
          requesterId: loggedInUser.id,
          recipientId: followerId,
        },
        {
          requesterId: followerId,
          recipientId: loggedInUser.id,
        },
        ],
      },
      }),
      prisma.notification.deleteMany({
      where: {
        OR: [
          {
            issuerId: loggedInUser.id,
            recipientId: followerId,
          },
          {
            issuerId: followerId,
            recipientId: loggedInUser.id,
          },
          ],
        type: "FOLLOW",
      },
      }),
      prisma.notification.deleteMany({
      where: {
        OR: [
          {
            issuerId: loggedInUser.id,
            recipientId: followerId,
          },
          {
            issuerId: followerId,
            recipientId: loggedInUser.id,
          },
          ],
        type: "ACCEPT_CONNECTION",
      },
      }),
    ]);

    

    return Response.json({ message: "Connection deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();
    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = params;

    const [updateResult, ...result] = await prisma.$transaction([
      prisma.connection.updateMany({
        where: {
          requesterId: userId,
          recipientId: loggedInUser.id,
          status: "PENDING",
        },
        data: {
          status: "CONNECTED",
        },
      }),
      prisma.notification.create({
        data: {
          issuerId: loggedInUser.id,
          recipientId: userId,
          type: "ACCEPT_CONNECTION",
        },
      }),
    ]);

    if (updateResult.count === 0) {
      return Response.json({ error: "Connection request not found or already accepted" }, { status: 404 });
    }

    return Response.json({ message: "Connection request accepted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}