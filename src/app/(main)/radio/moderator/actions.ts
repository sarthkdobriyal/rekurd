"use server";

import { validateRequest } from "@/auth";
import { isAuthUserRadioModerator } from "../actions";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function MarkSongReviewed(songId: string) {
  const user = await isAuthUserRadioModerator();

  if (!user) throw new Error("Unauthorized");

  const song = await prisma.radioSongRequest.update({
    where: { id: songId },
    data: {
      isReviewed: true,
    },
  });

  revalidatePath("/radio/moderator/manage");
}

export async function DeleteSong(songId: string) {
  const user = await isAuthUserRadioModerator();

  if (!user) throw new Error("Unauthorized");

  await prisma.radioSongRequest.delete({
    where: { id: songId },
  });

  revalidatePath("/radio/moderator/manage");
}

export async function AddSongToQueue(songId: string) {
  const user = await isAuthUserRadioModerator();

  if (!user) throw new Error("Unauthorized");

  await prisma.radioQueue.create({
    data: {
      songId,
      position: (await prisma.radioQueue.count()) + 1,
    },
  });

  revalidatePath("/radio/moderator/manage");
}

export async function IsSongInQueue(songId: string) {
  const user = await isAuthUserRadioModerator();

  if (!user) throw new Error("Unauthorized");

  const songInQueue = await prisma.radioQueue.findUnique({
    where: { songId },
  });

  return !!songInQueue;
}

export async function RemoveSongFromQueue(songId: string) {
  const user = await isAuthUserRadioModerator();

  if (!user) throw new Error("Unauthorized");

  console.log(songId)
  // Get the position of the song to be removed
  const songToRemove = await prisma.radioQueue.findUnique({
    where: { songId },
  });

  if (!songToRemove) throw new Error("Song not found in queue");

  // Remove the song from the queue
  await prisma.radioQueue.delete({
    where: { songId },
  });

  // Adjust the positions of the remaining songs
  const songsToUpdate = await prisma.radioQueue.findMany({
    where: {
      position: {
        gt: songToRemove.position,
      },
    },
    orderBy: {
      position: "asc",
    },
  });

  await prisma.$transaction(
    songsToUpdate.map((song, index) =>
      prisma.radioQueue.update({
        where: { id: song.id },
        data: { position: songToRemove.position + index },
      }),
    ),
  );


}
