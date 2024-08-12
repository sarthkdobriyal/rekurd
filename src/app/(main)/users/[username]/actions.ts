"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import {
  updateUserProfileSchema,
  UpdateUserProfileValues,
} from "@/lib/validation";

export async function updateUserProfile(values: UpdateUserProfileValues) {
  const validatedValues = updateUserProfileSchema.parse(values);

  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const { userContact, musicalInfo, ...userProfileData } = validatedValues;

  console.log("editing values")

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: validatedValues,
      select: getUserDataSelect(user.id, true),
    });

     // Update UserContact model
  if (userContact) {
    await prisma.userContact.upsert({
      where: { userId: user.id },
      create: userContact,
      update: userContact,
    });
  }

  // Update MusicalInfo model
  if (musicalInfo) {
    await prisma.musicalInfo.upsert({
      where: { userId: user.id },
      create: musicalInfo,
      update: musicalInfo,
    });
  }
    


  return updatedUser;
}