"use server"

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude } from "@/lib/types";
import { createPostSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";


export async function submitPost(input: {
  content: string;
  mediaIds: string[];
}) {
  try {
    const { user } = await validateRequest();

    if (!user) throw Error("Unauthorized");

    console.log(input.length)

    const { content, mediaIds } = createPostSchema.parse(input);

    const newPost = await prisma.post.create({
      data: {
        content,
        userId: user.id,
        attachments: {
          connect: mediaIds.map((id) => ({ id })),
        },
      },
      include: getPostDataInclude(user.id),
    });

    return newPost;
  } catch (error) {
    // Handle the error here
    console.error(error);
    throw error;
  }
}