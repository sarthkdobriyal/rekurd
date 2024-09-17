"use client"

import { Button } from '@/components/ui/button'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FC } from 'react'
import { RemoveSongFromQueue } from '../actions';
import { CircleX, Loader2 } from 'lucide-react';

interface RemoveSongFromQueueButtonProps {
  songId: string
}

const RemoveSongFromQueueButton: FC<RemoveSongFromQueueButtonProps> = ({songId}) => {
  
    const queryClient = useQueryClient();


    const removeSongMutation = useMutation({
        mutationFn: async (songId: string) => {
    
          try {
            await RemoveSongFromQueue(songId);
            queryClient.invalidateQueries({ queryKey: ['radio-queue'] });
          } catch (err) {
          } 
        },
      });
  
    return <Button
  variant="ghost"
  className="flex items-center"
  size="sm"
  onClick={() => removeSongMutation.mutate(songId)}
  disabled={removeSongMutation.isPending}
>
  {removeSongMutation.isPending? (
    <Loader2 className='animate-spin' />
  ) : (
    <CircleX className="mr-2 size-4" />
  )}
</Button>
}

export default RemoveSongFromQueueButton