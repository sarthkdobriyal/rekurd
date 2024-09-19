"use client"

import { FC } from "react";
import { Button } from "@/components/ui/button";
import { CirclePlay, CircleStop, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import { RadioSongPlaybackState } from "@/lib/types";

interface StartRadioProps {}

const StartRadio: FC<StartRadioProps> = ({}) => {
  const queryClient = useQueryClient();

  const { data, isError, isLoading } = useQuery({
    queryKey: ['radio-currently-playing'],
    queryFn: () => kyInstance.get('/api/radioQueue/currently-playing').json<RadioSongPlaybackState>(),
  });

  const startRadioMutation = useMutation({
    mutationFn: () => kyInstance.post('/api/web-socket/radio/start').json(),
    onSuccess: () => {
        console.log("success")
        queryClient.invalidateQueries({queryKey: ["radio-queue"]});
        queryClient.invalidateQueries({queryKey: ['radio-currently-playing']});
    },
  });

  const stopRadioMutation = useMutation({
    mutationFn: () => kyInstance.post('/api/web-socket/radio/stop').json(),
    onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ["radio-queue"]});
      queryClient.invalidateQueries({queryKey: ['radio-currently-playing']});
    },
  });

  const handleClick = () => {
    if (data) {
      stopRadioMutation.mutate();
    } else {
      startRadioMutation.mutate();
    }
  };

  if (isLoading) return <div><Loader2 className="animate-spin"/></div>;
  if (isError) return <div>Error</div>;

  return (
    <Button variant="ghost" onClick={handleClick} disabled={startRadioMutation.isPending || stopRadioMutation.isPending}>
    {startRadioMutation.isPending || stopRadioMutation.isPending ? (
      <Loader2 className="animate-spin" />
    ) : data ? (
      <CircleStop className="text-red-600" />
    ) : (
      <CirclePlay />
    )}
  </Button>
  );
};

export default StartRadio;