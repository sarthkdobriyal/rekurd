import { Button } from "@/components/ui/button";
import { Trash2, SquareGanttChart, CirclePlus, CirclePlay } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import CurrentQueue from "./CurrentQueue";
import StartRadio from "./StartRadio";

interface RadioQueueProps {}

const RadioQueue: FC<RadioQueueProps> = ({}) => {
  return (
    <div className="w-full py-2">
      <div className="flex justify-between w-full  py-1">
        <div className=" text-lg font-bold">
          Radio Queue
        </div>
        <div className="flex gap-x-2">
            <StartRadio />
            <Button variant="ghost">
              <Link href='/radio/moderator/manage'>
              <CirclePlus />
              </Link>
            </Button>
        </div>
      </div>
      <CurrentQueue />
    </div>
  );
};

export default RadioQueue;
