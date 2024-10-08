import { useSocket } from '@/app/providers/web-socket';
import { RadioMessage } from '@/lib/types';
import { Message } from '@prisma/client';
import { useQueryClient } from '@tanstack/react-query';

import { useEffect } from 'react';

type UseChatSocketConnectionProps = {
  addKey: string;
  queryKey: string;
  paramValue: string;
};

export const useChatSocketConnection = ({
  addKey,
  paramValue,
  queryKey,
}: UseChatSocketConnectionProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

 

  const handleNewMessage = (message: Message | RadioMessage) => {
    queryClient.setQueryData([queryKey, paramValue], (prev: any) => {
      if (!prev || !prev.pages || prev.pages.length === 0) return prev;
      const newPages = [...prev.pages];
      newPages[0] = {
        ...newPages[0],
        messages: [message, ...newPages[0].messages],
      };

      return {
        ...prev,
        pages: newPages,
      };
    });
  };

  useEffect(() => {
    if (!socket) return;
    socket.on(addKey, handleNewMessage);

    return () => {
      socket.off(addKey, handleNewMessage);
    };
  }, [addKey, queryKey, queryClient, socket]);
};