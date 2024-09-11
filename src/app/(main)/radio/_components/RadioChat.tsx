import { FC } from "react";
import SendMessage from "./SendMessage";
import RadioChatMessage from "./RadioChatMessage";

interface RadioChatProps {}

const RadioChat: FC<RadioChatProps> = ({}) => {
  return (
    <div className="flex h-full max-h-[40%]  w-full flex-col justify-between gap-y-2 ">
      <div className="scrollbar-hide flex  flex-col-reverse gap-y-2 overflow-y-scroll">
        <RadioChatMessage />
        <RadioChatMessage />
        <RadioChatMessage />
        <RadioChatMessage />
        <RadioChatMessage />
        <RadioChatMessage />
        <RadioChatMessage />
        <RadioChatMessage />
        <RadioChatMessage />
        <RadioChatMessage />
        <RadioChatMessage />
        <RadioChatMessage />
        <RadioChatMessage />
        <RadioChatMessage />
        <RadioChatMessage />
        <RadioChatMessage />
        <RadioChatMessage />
        <RadioChatMessage />
        <RadioChatMessage />
        <RadioChatMessage />
        <RadioChatMessage />
        <RadioChatMessage />
        <RadioChatMessage />
        <RadioChatMessage />
      </div>

      <SendMessage chatId="" />
    </div>
  );
};

export default RadioChat;
