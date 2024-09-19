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
      });
  
      if (!currentPlaybackState) {
        return res.status(404).json({ message: 'No song found in playback state' });
      }
  
      // Update the playback state to set paused to false
      const updatedPlaybackState = await prisma.radioPlaybackState.update({
        where: { id: currentPlaybackState.id },
        data: { paused: false },
      });
  
      // Emit the updated playback state to all clients
    //   res?.socket?.server?.io?.emit('global-radio-playback-state', updatedPlaybackState);
  
      return res.status(200).json({ message: 'Playback resumed', data: updatedPlaybackState });
  } catch (error) {
    console.error('MESSAGE CREATION ERROR: ', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}