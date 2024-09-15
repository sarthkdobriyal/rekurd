import { useSocket } from "@/app/providers/web-socket";
import kyInstance from "@/lib/ky";
import { MessagePage, RadioMessagePage } from "@/lib/types";
import { Message } from "@prisma/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

type ChatFetcherProps = {
  queryKey: string;
  apiUrl: string;
  paramValue: string;
};

export const useChatFetcher = ({
  apiUrl,
  queryKey,
  paramValue
}: ChatFetcherProps) => {
  const { isConnected } = useSocket();


  return useInfiniteQuery<MessagePage | RadioMessagePage>({
    queryKey: [queryKey, paramValue],
    queryFn: ({ pageParam }) => {
      if (pageParam) {
        return kyInstance
          .get(apiUrl, {
            //@ts-ignore
            searchParams: {
              chatId: paramValue,
              cursor: pageParam, // Ensure cursor is either a string or undefined
            },
          })
          .json<MessagePage | RadioMessagePage>();
      } else {
        return kyInstance
          .get(apiUrl, {
            searchParams: {
              chatId: paramValue,
            },
          })
          .json<MessagePage | RadioMessagePage>();
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    refetchInterval: isConnected ? false : 1000,
    retry: 3,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    initialPageParam: null as string | null,
  });
};
