import Image from "next/image";
import { FC } from "react";
import ListeningCount from "./_components/ListeningCount";

import RadioChat from "./_components/RadioChat";

import SubmitSongDialog from "./_components/SubmitSongDialog";
import { Button } from "@/components/ui/button";
import PublicRadioPlayer from "./_components/PublicRadioPlayer";
import { isAuthUserRadioModerator } from "./actions";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Logo } from "@/components/Logo";


interface RadioPageProps {}

const RadioPage: FC<RadioPageProps> = async ({}) => {

  return (
    <div className="flex w-full flex-col gap-y-4 h-full justify-center items-center">
        <span className="text-xl font-poppins">Coming soon...</span>
    </div>
  )



  // return (
  //   <div className="flex h-full  max-h-[95%] w-full flex-col items-start gap-y-2">
  //     <div className="flex w-full items-center gap-x-1 mb-3">
  //       <span className="text-2xl font-bold">Tune In Radio</span>
  //       <Image
  //         src="/tower.png"
  //         alt="radio-tower"
  //         className="animate-pulse"
  //         width={50}
  //         height={50}
  //       />
  //       <div className="ml-auto flex gap-x-2">         
  //         <ListeningCount />
  //       </div>
  //     </div>
  //     {/* <span className="font-sans text-sm font-semibold tracking-tighter text-muted-foreground">
  //       Your Jockey:
  //       <span className="ml-2 text-muted-foreground">DJ</span>
  //     </span> */}

  //     <PublicRadioPlayer />

  //     <div className="flex w-full gap-x-2">
  //       <SubmitSongDialog />
  //       <Button
  //         className="h-7 bg-white w-[50%] text-black hover:text-primary"
  //         variant="secondary"
  //       >
  //         Support Artist
  //       </Button>
  //     </div>

  //     <div className="w-full border my-3"></div>

  //     <RadioChat />
  //   </div>
  // );
};

export default RadioPage;
