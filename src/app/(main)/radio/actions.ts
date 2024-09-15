"use server"

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { submitSongSchema, SubmitSongValues } from "@/lib/validation";

export const addSongRequest = async (songDetails: SubmitSongValues) => {
    try {
        const { user } = await validateRequest();
    
        if (!user) throw Error("Unauthorized");
    
    
        const parsedData = submitSongSchema.parse(songDetails);
    
        const newSongRequest = await prisma.radioSongRequest.create({
          data: {
            title: parsedData.title,
            fileUrl: parsedData.fileUrl,
            albumArtUrl: parsedData.albumArtUrl,
            duration: 0,
            userId: user.id,
          },
        });
    
        return newSongRequest;
      } catch (error) {
        // Handle the error here
        console.error(error);
        throw error;
      }
}