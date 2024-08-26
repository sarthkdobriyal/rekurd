"use client";

import kyInstance from "@/lib/ky";
import { ConnectionInfo, UserData } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { connect } from "http2";
import useConnectionInfo from "@/hooks/useConnectionInfo";
import { Loader2, Trash2 } from "lucide-react";
import { useSession } from "@/app/(main)/SessionProvider";
import { useState } from "react";
import { useRouter } from "next/navigation";


interface FollowButtonProps {
  userId: string;
  initialState: ConnectionInfo;
}

export default function ConnectionButton({
  userId,
  initialState,
}: FollowButtonProps) {
  const { toast } = useToast();

  const { user: loggedInUser } = useSession();

  const router = useRouter();
  const queryClient = useQueryClient();

  const [decision, setDecision] = useState("");

  const { data, isLoading: isConnectionInfoLoading } = useConnectionInfo(userId, initialState);

  const queryKey: QueryKey = ["connection-info", userId];

  const isLoggedInUserReciepient = data.isLoggedInUserReciepient;
  const isLoggedInUserSender = data.isLoggedInUserSender;


  const { mutate } = useMutation({
    mutationFn: (decision: string) =>
      data.isUserConnected
      ? kyInstance.delete(`/api/users/${userId}/connection`) :
      isLoggedInUserReciepient && decision !== "reject"
        ? kyInstance.patch(`/api/users/${userId}/connection`)
        : (isLoggedInUserReciepient && decision === "reject") ||
            (isLoggedInUserSender && data.isConnectionPending)
          ? kyInstance.delete(`/api/users/${userId}/connection`)
          : kyInstance.post(`/api/users/${userId}/connection`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previousState = queryClient.getQueryData<ConnectionInfo>(queryKey);

      queryClient.setQueryData<ConnectionInfo>(queryKey, () => ({
        connections:
          (previousState?.connections || 0) +
          (decision === "accept"
            ? 1 : 
            previousState?.isUserConnected ? -1 
            : 0),
        isUserConnected:previousState?.isUserConnected ? !previousState?.isUserConnected : isLoggedInUserReciepient && decision !== "reject",
        isConnectionPending: !previousState?.isUserConnected && !previousState?.isConnectionPending,
        isLoggedInUserReciepient: previousState?.isUserConnected ? false :  !!previousState?.isLoggedInUserReciepient && decision !=="reject",
        isLoggedInUserSender: !previousState?.isUserConnected && !previousState?.isLoggedInUserReciepient && !previousState?.isLoggedInUserSender,
      }));

      return { previousState };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousState);
      const errorMessage = error.message.includes("400")  ? "Connection already exists! Reload to accept/reject": "Something went wrong!"
      
      toast({
        variant: "destructive",
        description: errorMessage,
      });

      window.location.reload()
      
    },
  });

  if (isConnectionInfoLoading) {
    return (
      <div className="flex justify-center items-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }


  return (
    <>
      {isLoggedInUserReciepient && data.isConnectionPending ? (
        <div className="flex w-full justify-center gap-4">
          <Button
            variant={"default"}
            onClick={() => {
              setDecision("accept");
              mutate("accept");
            }}
            className="bg-secondary"
          >
            Accept
          </Button>
          <Button
            variant={"destructive"}
            onClick={() => {
              setDecision("reject");
              mutate("reject");
            }}
          >
            Reject
          </Button>
        </div>
      ) : (
        <Button
          variant={
            data.isConnectionPending
              ? "secondary"
              : data.isUserConnected
                ? "outline"
                : "default"
          }
          onClick={() => mutate("")}
        >
          {isLoggedInUserSender && data.isConnectionPending ? (
            <div className="flex w-full items-center justify-between">
              <span className="mr-3">Requested</span>
              <Trash2 size={15} />
            </div>
          ) : data.isUserConnected ? (
            <div className="flex w-full items-center justify-between">
              <span className="mr-3">Connected</span>
              <Trash2 size={15} />
            </div>
          ) : (
            "JAM"
          )}
        </Button>
      )}
    </>
  );
}
