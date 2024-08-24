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


    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: userProfileData,
      select: getUserDataSelect(user.id, true),
    });

     // Update UserContact model
     if (userContact) {
      await prisma.userContact.upsert({
        where: { userId: user.id },
        update: userContact,
        create: { ...userContact, userId: user.id }, // Ensure userId is set for creation
      });
    }
    
    console.log(musicalInfo);

  // Update MusicalInfo model
  if (musicalInfo) {
    const { primaryInstrument, ...musicalInfoData } = musicalInfo;
    await prisma.musicalInfo.upsert({
      where: { userId: user.id },
      update: {
        ...musicalInfoData,
        primaryInstrument: {
          connect: { id: musicalInfo.primaryInstrument?.id },
        },
      },
      // @ts-ignore
      create: {
        ...musicalInfoData,
        primaryInstrument: {
          connect: { id: musicalInfo.primaryInstrument?.id },
        },
        user: {
          connect: { id: user.id },
        },
      },
    });
  }
    


  return updatedUser;
}