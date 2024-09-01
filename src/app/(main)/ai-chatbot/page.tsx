"use client";
import React, { useState, useRef, useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/Switch";
import useChatStorage from "@/hooks/useAiChatStorage";
import { useMutation } from "@tanstack/react-query";
import {
  ChatRequest,
  ChatRequestSchema,
  ChatResponse,
  ChatResponseSchema,
  Message,
} from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast";
import kyInstance from "@/lib/ky";
import { Bot, Loader, MessageCircle, SendHorizontal, UserRound } from "lucide-react";
import ReactMarkdown from "react-markdown";


const MusicChatbot: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const { messages, addMessage, clearMessages, syncToCloud, toggleCloudSync } =
    useChatStorage();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const mutation = useMutation<ChatResponse, Error, ChatRequest>({
    mutationFn: async (newMessage) => {
      // Validate the message using Zod
      const parsedMessage = ChatRequestSchema.parse(newMessage);

      // Use kyInstance to send the request
      const response = await kyInstance.post("/api/ai-chat", {
        json: parsedMessage,
      });

      if (!response.ok) {
        throw new Error("An error occurred while sending the message.");
      }

      // Validate the response using Zod
      const data = ChatResponseSchema.parse(await response.json());
      return data;
    },
    onSuccess: (data: ChatResponse) => {
      addMessage({ role: "user", content: input });
      addMessage({ role: "assistant", content: data.message });
      console.log(data.message);
      setInput("");
    },
    onError: (error: Error) => {
      console.error(error);
      toast({
        title: error.message.split(":")[0],
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ message: input });
  };

  return (
    <div className="flex w-full h-full lg flex-col">
      {/* <Card className="flex flex-grow flex-col">
        <CardHeader>
          <CardTitle>Chat with Your Music AI </CardTitle>
        </CardHeader>
        <CardContent className="flex  flex-col h-fit">
         
        </CardContent>
      </Card> */}
      <div className="scrollbar-hide w-full flex-grow overflow-y-auto">
        {
          messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-y-2">
                <MessageCircle className="h-10 w-10 text-muted" />
                <p className="text-muted text-lg font-bold">Chat with Your Music AI</p>
              </div>
            </div>
          )
        }
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex  items-end gap-x-2 ${message.role === "user" ? "justify-end" : "justify-start"} mb-2 ${index === messages.length - 1 ? "mb-20" : ""}`}
          >
            {message.role !== "user" && <Bot className="h-7 w-7 text-muted" />}
            <div
              className={`${message.role === "user" ? "bg-primary text-white" : "bg-muted text-white"} flex max-w-[80%] items-center rounded-lg p-2`}
            >
              <div className="flex flex-col">
               <ReactMarkdown
               className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl prose-custom" 
               >{message.content}</ReactMarkdown>
              </div>
            </div>
            {message.role === "user" && (
              <UserRound className="h-7 w-7 text-muted" />
            )}
          </div>
        ))}
        {mutation.isPending && (
          <div className="mb-2 flex justify-start">
            <div className="flex gap-x-2 rounded-lg p-2 text-white backdrop-blur-2xl">
              <Loader className="h-5 w-5 animate-spin" />
              Thinking... (This may take up to 30 seconds)
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
        {mutation.isError && (
        <Alert variant="destructive" className="mb-32">
          <AlertDescription>{mutation.error.message}</AlertDescription>
        </Alert>
      )}
      </div>
      
      <div className="sticky bottom-[69px] left-0 rounded-xl p-5 backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between">
          <Button onClick={clearMessages} variant="outline">
            Clear Chat History
          </Button>
          {/* <div className="flex items-center space-x-2">
            <Switch
              checked={syncToCloud}
              onCheckedChange={toggleCloudSync}
              id="cloud-sync"
            />
            <label htmlFor="cloud-sync">Sync to Cloud</label>
          </div> */}
        </div>
        <form onSubmit={handleSubmit} className="flex space-x-2 ">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for music inspiration..."
            className="flex-grow"
          />
          <Button type="submit" disabled={mutation.isPending}>
          <SendHorizontal  />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default MusicChatbot;
