import { Button } from "@/components/ui/button";
import { Trash2, SquareGanttChart, CirclePlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface RadioQueueProps {}

const RadioQueue: FC<RadioQueueProps> = ({}) => {
  return (
    <div className="w-full py-2">
      <div className="flex justify-between w-full border-b py-1">
        <div className=" text-lg font-bold">
          Radio Queue
        </div>
        <div className="flex gap-x-2">
            <Button variant="ghost">
              <Link href='/radio/moderator/manage'>
            <SquareGanttChart />
              </Link>

            </Button>
            <Button variant="ghost">
            <CirclePlus />
            </Button>
        </div>
      </div>
      <div className="scrollbar-hide flex h-full max-h-[17rem] flex-col gap-y-1 overflow-auto px-4 py-1">
        <div className="flex items-center border-b py-2 font-sans">
          {/* <div className="flex h-full items-center justify-center p-4 text-lg">
            1.
          </div> */}

          <Image
            src="/record.jpg"
            alt="record"
            width={50}
            height={50}
            className="object-contain"
          />
          <div className="flex flex-col px-4">
            <span className="">Bheege Honth Tere</span>
            <span className="text-sm text-muted-foreground">Imran Hashmi</span>
          </div>

          <div className="ml-auto mr-3">
            <Trash2 className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        <div className="flex items-center border-b py-2 font-sans">
          {/* <div className="flex h-full items-center justify-center p-4 text-lg">
            1.
          </div> */}

          <Image
            src="/record.jpg"
            alt="record"
            width={50}
            height={50}
            className="object-contain"
          />
          <div className="flex flex-col px-4">
            <span className="">Bheege Honth Tere</span>
            <span className="text-sm text-muted-foreground">Imran Hashmi</span>
          </div>

          <div className="ml-auto mr-3">
            <Trash2 className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        <div className="flex items-center border-b py-2 font-sans">
          {/* <div className="flex h-full items-center justify-center p-4 text-lg">
            1.
          </div> */}

          <Image
            src="/record.jpg"
            alt="record"
            width={50}
            height={50}
            className="object-contain"
          />
          <div className="flex flex-col px-4">
            <span className="">Bheege Honth Tere</span>
            <span className="text-sm text-muted-foreground">Imran Hashmi</span>
          </div>

          <div className="ml-auto mr-3">
            <Trash2 className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        <div className="flex items-center border-b py-2 font-sans">
          {/* <div className="flex h-full items-center justify-center p-4 text-lg">
            1.
          </div> */}

          <Image
            src="/record.jpg"
            alt="record"
            width={50}
            height={50}
            className="object-contain"
          />
          <div className="flex flex-col px-4">
            <span className="">Bheege Honth Tere</span>
            <span className="text-sm text-muted-foreground">Imran Hashmi</span>
          </div>

          <div className="ml-auto mr-3">
            <Trash2 className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadioQueue;
