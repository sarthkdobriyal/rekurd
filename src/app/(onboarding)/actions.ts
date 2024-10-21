"use server"

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { updateUserInfoSchema, updateUserInfoValues } from "@/lib/validation";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function updateUserAction(data: updateUserInfoValues, userId: string) {

  const session = await validateRequest();
  if (!session.user || session.user.id !== userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

 
  const parsedData = updateUserInfoSchema.safeParse(data);
  if (!parsedData.success) {
    return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      displayName: parsedData.data.displayName,
      username: parsedData.data.username,
    //   avatarUrl: data.avatarUrl, // Assuming avatarUrl is part of updateUserInfoValues
    },
  });

  revalidatePath('/onboarding')
  
}