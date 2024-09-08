import { useSocket } from '@/app/providers/web-socket';
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

  const handleUpdateMessage = (message: any) => {
    queryClient.setQueryData([queryKey, paramValue], (prev: any) => {
      if (!prev || !prev.pages || !prev.pages.length) return prev;

      const newData = prev.pages.map((page: any) => ({
        ...page,
        data: page.data.map((data: Message) => {
          if (data.id === message.id) {
            return message;
          }
          return data;
        }),
      }));

      return {
        ...prev,
        pages: newData,
      };
    });
  };

  const handleNewMessage = (message: Message) => {
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