import { getLoggedInUserPages } from '@/actions/getLoggedInUserPages';
import { validateRequest, validateRequestForPages } from '@/auth';
import prisma from '@/lib/prisma';
import { RadioMessage, SockerIoApiResponse } from '@/lib/types';
import { NextApiRequest} from 'next';
import RadioChatMessage from '../../../../app/(main)/radio/_components/RadioChatMessage';

export default async function handler(
  req: NextApiRequest,
  res: SockerIoApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {user} = await validateRequestForPages(req, res)
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if the user is a moderator
    const isModerator = await prisma.radioModerator.findUnique({
        where: { userId: user.id },
      });
  
      if (!isModerator) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
    // Fetch the current playback state
    const currentPlaybackState = await prisma.radioPlaybackState.findFirst({
        orderBy: { startedAt: 'desc' },
      });
  
      if (!currentPlaybackState) {
        return res.status(404).json({ message: 'No song found in playback state' });
      }
  
      // Remove the currently playing song from the playback state
      await prisma.radioPlaybackState.delete({
        where: { id: currentPlaybackState.id },
      });
  
      // Fetch the next song in the queue
      const nextQueueEntry = await prisma.radioQueue.findFirst({
        orderBy: { position: 'asc' },
        include: { song: true },
      });
  
      if (!nextQueueEntry) {
        return res.status(404).json({ message: 'No songs in the playlist' });
      }
  
      // Remove the next song from the queue
      await prisma.radioQueue.delete({
        where: { id: nextQueueEntry.id },
      });
  
      // Add the next song to the playback state
      const newPlaybackState = await prisma.radioPlaybackState.create({
        data: {
          songId: nextQueueEntry.songId,
          startedAt: new Date(),
          paused: false,
        },
      });
  
      // Emit the updated playback state to all clients
    //   res?.socket?.server?.io?.emit('global-radio-playback-state', newPlaybackState);
  
      return res.status(200).json({ message: 'Playing next song', data: newPlaybackState });
  } catch (error) {
    console.error('MESSAGE CREATION ERROR: ', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}