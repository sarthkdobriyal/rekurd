"use server"

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { musicalInfoSchema, MusicalInfoValues, updateUserInfoSchema, updateUserInfoValues } from "@/lib/validation";
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


export async function updateUserMusicalInfoAction(data: MusicalInfoValues, userId: string) {
  const session = await validateRequest();
  if (!session.user || session.user.id !== userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }



  const parsedData = musicalInfoSchema.safeParse(data);
  if (!parsedData.success) {
    return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
  }

  console.log(parsedData.data)

  // const updatedMusicalInfo = await prisma.musicalInfo.upsert({
  //   where: { userId: userId },
  //   update: {
  //     title: parsedData.data.title,
  //     yearsOfExperience: parsedData.data.yearsOfExperience,
  //     instruments: parsedData.data.instruments,
  //   },
  //   create: {
  //     userId: userId,
  //     title: parsedData.data.title,
  //     yearsOfExperience: parsedData.data.yearsOfExperience,
  //     instruments: parsedData.data.instruments,
  //   }
  // });

  revalidatePath('/onboarding');

}