"use client";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { set } from "date-fns";
import {
  CalendarIcon,
  FacebookIcon,
  GitCompareArrowsIcon,
  PersonStandingIcon,
  PlusIcon,
  RocketIcon,
} from "lucide-react";
import { FC, useState, useTransition } from "react";
import { ConnectedUser, createChat } from "../actions";
import UserAvatar from "../../../../components/UserAvatar";

interface CreateChatDialogProps {
  connectedUsers: ConnectedUser[];
}

const CreateChatDialog: FC<CreateChatDialogProps> = ({ connectedUsers }) => {
  const [open, setOpen] = useState(false);

  const [isPending, startTransition] = useTransition();

  const handleCreateChat = (userId: string) => {
    startTransition(() => {
      createChat(userId);
    });
  };

  return (
    <>
      <Button
        onClick={() => setOpen((p) => !p)}
        variant="ghost"
        size="icon"
        className="rounded-full"
      >
        <PlusIcon />
        <span className="sr-only">New Chat</span>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a friends name..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {isPending ? (
            <div className="flex h-full w-full flex-col items-center justify-center py-5 ">
              <RocketIcon className="h-14 w-14 text-primary animate-pulse" />
              <span className="text-lg font-medium">Creating chat...</span>
            </div>
          ) : (
            <CommandGroup
              heading="Click on a friend to start a chat"
              className="gap-y-3"
            >
              {connectedUsers.map((user) => (
                <CommandItem key={user.id}>
                  <div
                    onClick={() => handleCreateChat(user.id)}
                    className="flex items-center gap-2 rounded-xl"
                  >
                    <UserAvatar
                      avatarUrl={user.avatarUrl}
                      className="h-10 w-10"
                    />
                    <div className="flex flex-col">
                      <span className="text-lg">{user.displayName}</span>
                      <span className="text-xs text-muted-foreground">
                        @{user.username}
                      </span>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default CreateChatDialog;
