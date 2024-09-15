"use client";

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { submitSongFormSchema, SubmitSongFormValues, submitSongSchema, SubmitSongValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { AvatarInput } from "../../users/[username]/EditProfileDialog";
import { Image, ImageIcon, Upload, Loader2 } from "lucide-react";
import useMediaUpload from "@/components/posts/editor/useMediaUpload";
import useSongUpload from "../useSongUpload";
import { useToast } from "@/components/ui/use-toast";
import { addSongRequest } from "../actions";

interface SubmitSongDialogProps {}

const SubmitSongDialog: FC<SubmitSongDialogProps> = ({}) => {
  const form = useForm<SubmitSongFormValues>({
    resolver: zodResolver(submitSongFormSchema),
    defaultValues: {
      title: "",
    },
  });

  const [coverArt, setCoverArt] = useState<File>();
  const [song, setSong] = useState<File>();
  const [open, setOpen] = useState(false);

  const {
    attachments,
    isUploading,
    removeAttachment,
    reset: resetMediaUploads,
    startUpload,
    uploadProgress,
  } = useSongUpload();
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();

  console.log(coverArt, song, "wow", attachments);

  const onSubmit = async (values: {
    title: string;
  }) => {
    // Handle form submission logic here
    console.log("wow")
    try {
      if (attachments.length === 0) {
        return toast({
          variant: "destructive",
          description: "Please upload a song file",
        });
      }

      const audioAttachment = attachments.find((attachment) =>
        attachment.file.type.includes("audio"),
      );
      const AlbumArtAttachment = attachments.find((attachment) =>
        attachment.file.type.includes("image"),
      );

      if (!audioAttachment) {
        console.log("no audio")
        return toast({
          variant: "destructive",
          description: "Audio file not found in attachments",
        });
      }


      const data: SubmitSongValues = {
        title: values.title,
        fileUrl: audioAttachment.fileUrl!,
        albumArtUrl: AlbumArtAttachment?.fileUrl,

      };
      startTransition(async () => {
        try {
          const newSongData = await addSongRequest(data);
          console.log(newSongData);
          resetMediaUploads();
          form.reset();
          setCoverArt(undefined);
          setSong(undefined);
          setOpen(false);
          toast({
            variant: "default",
            description: "Song request submitted successfully!",
          });
        } catch (err) {
          console.log(err);
          toast({
            variant: "destructive",
            description: "Some error occurred. Please try again!",
          });
        }
      });

    } catch (err) {
      console.log(err);
      toast({
        variant: "destructive",
        description: "Some Error Occurred. Please try again!",
      });
    }

    // Further processing with `data`
  };

  return (
    <Dialog open={open}  onOpenChange={setOpen}>
      <DialogTrigger className="h-7 w-[50%] flex-1 rounded-sm bg-white text-black hover:bg-muted hover:text-primary">
        Submit a Song request
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit a Song Request</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <AddCoverArtButton
          onFilesSelected={startUpload}
          disabled={isUploading}
        />
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
            <div>
              <AddSongRequestButton
                onFilesSelected={startUpload}
                disabled={isUploading}
              />
            </div>
            <DialogFooter>
              <Button type="submit">
                {isPending ? <><Loader2/></> :  isUploading ? (
                  <span className="flex gap-x-2">
                    {uploadProgress}
                    <Loader2 />
                  </span>
                ) : (
                  "Submit"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

interface AddSongRequestButtonProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

function AddSongRequestButton({
  onFilesSelected,
  disabled,
}: AddSongRequestButtonProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div
        className={`flex w-full ${disabled ? "cursor-not-allowed" : "cursor-pointer"} items-center justify-center rounded-xl border-2 border-muted py-4 text-muted-foreground`}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mr-2 h-6 w-6 text-muted" />
        <span className="text-sm font-semibold text-muted-foreground">
          {fileName ? fileName : "Upload a song (mp3)"}
        </span>
      </div>
      <input
        disabled={disabled}
        type="file"
        accept="audio/*"
        multiple
        ref={fileInputRef}
        className="sr-only hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length) {
            setFileName(files[0].name);
            onFilesSelected(files);
            e.target.value = "";
          }
        }}
      />
    </>
  );
}

interface AddCoverArtButtonProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

function AddCoverArtButton({
  onFilesSelected,
  disabled,
}: AddCoverArtButtonProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center">
      <Button
        variant="ghost"
        size="icon"
        className="text-primary hover:text-primary"
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
      >
        <ImageIcon size={20} />
      </Button>
      <span className="text-sm text-muted-foreground">
        {fileName ? fileName : "Upload Cover Art"}
      </span>
      <input
        disabled={disabled}
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="sr-only hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length) {
            setFileName(files[0].name);
            onFilesSelected(files);
            e.target.value = "";
          }
        }}
      />
    </div>
  );
}

export default SubmitSongDialog;
