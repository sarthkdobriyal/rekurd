"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, SendIcon } from "lucide-react";
import { FC, useState, useTransition } from "react";

import kyInstance from "@/lib/ky";
import axios from "axios";

interface SendMessageProps {
  chatId: string;
}

const SendMessage: FC<SendMessageProps> = ({ chatId }) => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [isPending, startTransition] = useTransition();

  const handleSendMessage = async () => {
    if (!message) return setError(() => "Empty message");
    startTransition(async () => {
      if (message !== "") {
        try {
          const res = await axios.post('/api/web-socket/radio-global-chat', {
            content : message,
            chatId : chatId
          })
          if(res.status === 201) setMessage("");
          else setError("Error sending message");
        } catch (err) {
          console.log(err)
          setError("Failed to send message");
        }
      }
    });
  };


  return (
    <form action={handleSendMessage} className="flex w-full items-center space-x-2 ">
      <div className=" flex flex-col w-full gap-y-2">
        {message === "" && error !== ""  && <div className="text-red-500">{error}</div>}
        <Input
          id="message"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            setError("");
          }}
          placeholder="type here"
          className=""
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
