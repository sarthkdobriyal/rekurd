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
  
      // Fetch the first song in the queue
      const firstQueueEntry = await prisma.radioQueue.findFirst({
        orderBy: { position: 'asc' },
        include: { song: true },
      });
  
      if (!firstQueueEntry) {
        return res.status(404).json({ message: 'No songs in the queue' });
      }
  
      // Remove the first song from the queue
      await prisma.radioQueue.delete({
        where: { id: firstQueueEntry.id },
      });
  
      // Create a new entry in RadioPlaybackState
      const newPlaybackState = await prisma.radioPlaybackState.create({
        data: {
          songId: firstQueueEntry.songId,
          startedAt: new Date(),
          paused: false,
        },
      });
  
    //   // Emit the new playback state to all clients
    //   const message = {
    //     song: firstQueueEntry.song,
    //     startedAt: newPlaybackState.startedAt,
    //   };
    //   res?.socket?.server?.io?.emit('global-radio-playback-state', message);
  
      return res.status(201).json({ message: 'Playback started', data: newPlaybackState });
  } catch (error) {
    console.error('MESSAGE CREATION ERROR: ', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}