import { getLoggedInUserPages } from '@/actions/getLoggedInUserPages';
import { validateRequest, validateRequestForPages } from '@/auth';
import prisma from '@/lib/prisma';
import { SockerIoApiResponse } from '@/lib/types';
import { NextApiRequest} from 'next';

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

    const { chatId, content } = req.body;

    console.log(user.username, chatId, content);

    if (content === '') {
      return res.status(400).json({ message: 'Message content empty' });
    }

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: chatId,
      },
      select: {
        users: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const isUserInConversation = conversation.users.some(
      (user) => user.id === user.id
    );

    if (!isUserInConversation) {
      return res.status(403).json({ message: 'User not in conversation' });
    }

    const message = await prisma.message.create({
      data: {
        content,
        senderId: user.id,
        conversationId: chatId,
      },
    });

    res?.socket?.server?.io?.emit(`chat-${chatId}-messages`, message);

    return res.status(201).json({ message: 'Message created', data: message });
  } catch (error) {
    console.error('MESSAGE CREATION ERROR: ', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}