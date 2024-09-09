"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, SendIcon } from "lucide-react";
import { FC, useState, useTransition } from "react";
import { sendMessage } from "../actions";
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
          const res = await axios.post('/api/web-socket/messages', {
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
