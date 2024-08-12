"use client";

import useFollowerInfo from "@/hooks/useFollowerInfo";
import kyInstance from "@/lib/ky";
import { ConnectionInfo, FollowerInfo } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { connect } from "http2";
import useConnectionInfo from "@/hooks/useConnectionInfo";
import { Trash2 } from "lucide-react";

interface FollowButtonProps {
  userId: string;
  initialState: FollowerInfo;
}

export default function ConnectionButton({
  userId,
  initialState,
}: FollowButtonProps) {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { data } = useConnectionInfo(userId, initialState);

  const queryKey: QueryKey = ["connection-info", userId];

  console.log(data, "data")


  const { mutate } = useMutation({
    mutationFn: () =>
      data.isUserConnected || data.isConnectionPending
        ? kyInstance.delete(`/api/users/${userId}/connection`)
        : kyInstance.post(`/api/users/${userId}/connection`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<ConnectionInfo>(queryKey);

      queryClient.setQueryData<ConnectionInfo>(queryKey, () => ({
        connections:
          (previousState?.connections || 0) +
          (previousState?.isUserConnected || previousState?.isConnectionPending ? -1 : 1),
        isUserConnected: previousState?.isUserConnected,
        isConnectionPending: !previousState?.isConnectionPending,
      }));

      return { previousState };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again.",
      });
    },
  });

  return (
    <Button
      variant={data.isConnectionPending ? "secondary" : data.isUserConnected ? "outline" : "default"}
      onClick={() => mutate()}
    >
      {data.isConnectionPending  ? <div className="flex w-full  justify-between items-center">
        <span className=" mr-3">Requested</span>
        <Trash2 size={15} />
      </div> : data.isUserConnected ? <div className="flex w-full  justify-between items-center">
        <span className="mr-3">Connected</span>
        <Trash2 size={15} />
        </div>
         :  "JAM"}
    </Button>
  );
}