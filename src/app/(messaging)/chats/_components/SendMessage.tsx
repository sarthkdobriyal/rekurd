"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, SendIcon } from "lucide-react";
import { FC, useState, useTransition } from "react";
import { sendMessage } from "../actions";

interface SendMessageProps {
  chatId: string;
}

const SendMessage: FC<SendMessageProps> = ({ chatId }) => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [isPending, startTransition] = useTransition();

  const handleSendMessage = async () => {
    if (!message) return setError(() => "Empty message");
    startTransition(() => {
      if (message !== "") {
        sendMessage(chatId, message);
        setMessage("");
      }
    });
  };

  console.log(error, "eror");

  return (
    <form action={handleSendMessage} className="sticky bottom-2 left-0 flex  w-full items-center space-x-2 p-3">
      <div className=" flex flex-col w-full gap-y-2">
        {message === "" && error !== ""  && <div className="text-red-500">{error}</div>}
        <Input
          id="message"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            setError("");
          }}
          placeholder="Type your message..."
          className="flex-1 py-5"
          autoComplete="off"
        />
      </div>
      <Button disabled={isPending} type="submit" size="sm">
        {
            isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <SendIcon className="h-5 w-5" />
        }
        <span className="sr-only">Send</span>
      </Button>
    </form>
  );
};

export default SendMessage;
