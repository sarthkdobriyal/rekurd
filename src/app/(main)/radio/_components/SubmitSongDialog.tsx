"use client"

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { submitSongSchema, SubmitSongValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { AvatarInput } from '../../users/[username]/EditProfileDialog';

interface SubmitSongDialogProps {}

const SubmitSongDialog: FC<SubmitSongDialogProps> = ({}) => {

    const form = useForm<SubmitSongValues>({
        resolver: zodResolver(submitSongSchema),
        defaultValues: {
          title: "",
          fileUrl: "",
          duration: 0,
          albumArtUrl: "",
        },
      });

      const onSubmit = (values: SubmitSongValues) => {
        console.log(values);
        // Handle form submission logic here
      };
    

  return (
    <Dialog>
      <DialogTrigger className="h-7 w-[50%] flex-1 hover:bg-muted bg-white rounded-sm text-black hover:text-primary">
          Submit a Song request
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit  a Song Request</DialogTitle>
          <DialogDescription>
            
          </DialogDescription>
        </DialogHeader>
        <div>
          
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Song Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter song title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Confirm</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitSongDialog;
