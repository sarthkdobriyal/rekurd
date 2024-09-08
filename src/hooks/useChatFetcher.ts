import { useSocket } from "@/app/providers/web-socket";
import { Message } from "@prisma/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

type ChatFetcherProps = {
  queryKey: string;
  apiUrl: string;
  paramKey: "chatId";
  paramValue: string;
  pageSize: number;
};

export const useChatFetcher = ({
  apiUrl,
  queryKey,
  pageSize,
  paramKey,
  paramValue,
}: ChatFetcherProps) => {
  const { isConnected } = useSocket();

  const fetcher = async ({
    pageParam = 0,
  }: any): Promise< {messages: Message[]}> => {
    const url = `${apiUrl}?${paramKey}=${encodeURIComponent(
      paramValue,
    )}&page=${pageParam}&size=${pageSize}`;

    const { data } = await axios.get<Message[]>(url);


    return data as any;
  };

  return useInfiniteQuery<{messages: Message[]}>({
    queryKey: [queryKey, paramValue],
    queryFn: fetcher,
    getNextPageParam: (lastPage, allPages) => {
      lastPage?.messages.length === pageSize ? allPages.length : undefined;
    },
    // refetchInterval: isConnected ? false : 1000,
    retry: 3,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    initialPageParam: 0,
  });
};
