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

    const { content } = req.body;


    if (content === '') {
      return res.status(400).json({ message: 'Message content empty' });
    }


    const prismaMessage = await prisma.radioChatMessage.create({
      data: {
        content,
        userId: user.id,
      },
    });

    const message: RadioMessage = {
      ...prismaMessage,
      user: {
        id: user.id,
        username: user.username,
        avatarUrl: user.avatarUrl,
      }
    }

    res?.socket?.server?.io?.emit(`global-radio-chat-message`, message);

    return res.status(201).json({ message: 'Message created', data: message });
  } catch (error) {
    console.error('MESSAGE CREATION ERROR: ', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}