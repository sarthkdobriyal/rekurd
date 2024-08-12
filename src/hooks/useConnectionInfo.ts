import kyInstance from "@/lib/ky";
import { ConnectionInfo } from "@/lib/types";
import { Connection } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export default function useConnectionInfo(
  userId: string,
  initialState: ConnectionInfo,
) {
  const query = useQuery({
    queryKey: ["connection-info", userId],
    queryFn: () => kyInstance.get(`/api/users/${userId}/connection`).json<ConnectionInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  return query;
}