"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import {
  musicalInfoSchema,
  MusicalInfoValues,
  updateUserInfoSchema,
  updateUserInfoValues,
  userContactSchema,
  UserContactValues,
} from "@/lib/validation";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function updateUserAction(
  data: updateUserInfoValues,
  userId: string,
) {
  const session = await validateRequest();
  if (!session.user || session.user.id !== userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsedData = updateUserInfoSchema.safeParse(data);
  if (!parsedData.success) {
    return NextResponse.json(
      { error: parsedData.error.errors },
      { status: 400 },
    );
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      displayName: parsedData.data.displayName,
      username: parsedData.data.username,
      //   avatarUrl: data.avatarUrl, // Assuming avatarUrl is part of updateUserInfoValues
    },
  });

  await updateUserOnboarding(2);

  revalidatePath("/onboarding");
}

export async function updateUserMusicalInfoAction(
  data: MusicalInfoValues,
  userId: string,
  onboardingStep: number,
) {
  const session = await validateRequest();
  if (!session.user || session.user.id !== userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsedData = musicalInfoSchema.safeParse(data);
  if (!parsedData.success) {
    return NextResponse.json(
      { error: parsedData.error.errors },
      { status: 400 },
    );
  }


  const updatedMusicalInfo = await prisma.musicalInfo.upsert({
    where: { userId: userId },
    update: {
      title: parsedData.data.title,
      yearsOfExperience: parsedData.data.yearsOfExperience,
      instruments: parsedData.data.instruments,
      bio: parsedData.data.bio,
      genres: parsedData.data.genres,
      interestedInLearning: parsedData.data.interestedInLearning,
      interestedInTutoring: parsedData.data.interestedInTutoring,
    },
    create: {
      userId: userId,
      title: parsedData.data.title,
      yearsOfExperience: parsedData.data.yearsOfExperience,
      instruments: parsedData.data.instruments,
      bio: parsedData.data.bio,
      genres: parsedData.data.genres,
      interestedInLearning: parsedData.data.interestedInLearning,
      interestedInTutoring: parsedData.data.interestedInTutoring,
    }
  });

  await updateUserOnboarding(onboardingStep);

  revalidatePath("/onboarding");
}

export async function updateUserLocationAction(
  data: UserContactValues,
  coordinates: GeolocationCoordinates,
  userId: string,
) {
  const session = await validateRequest();
  if (!session.user || session.user.id !== userId) {
    return null;
  }

  const parsedData = userContactSchema.safeParse(data);
  if (!parsedData.success) {
    return null;
  }

  const updatedUserContact = await prisma.userContact.upsert({
    where: { userId: userId },
    update: {
      city: parsedData.data.city,
      country: parsedData.data.country,
    },
    create: {
      userId: userId,
      city: parsedData.data.city,
      country: parsedData.data.country,
    },
  });


  const updatedUserLocation = await prisma.userLocation.upsertLocation({
    userId: userId,
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
  });

  revalidatePath("/onboarding");
}


export async function updateUserOnboarding(step: number) {
  const session = await validateRequest();
  if (!session.user) {
    return null;
  }

  const updatedUser = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      onboardingStep: step,
    },
  });

  return updatedUser;
}