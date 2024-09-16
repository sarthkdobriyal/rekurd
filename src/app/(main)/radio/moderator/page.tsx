import { FC } from "react";
import { isAuthUserRadioModerator } from "../actions";
import { redirect } from "next/navigation";
import Image from "next/image";
import ListeningCount from "../_components/ListeningCount";
import Player from "../_components/Player";
import SubmitSongDialog from "../_components/SubmitSongDialog";
import { Button } from "@/components/ui/button";
import RadioChat from "../_components/RadioChat";
import ModeratorPlayer from "./_components/ModeratorPlayer";
import RadioQueue from "./_components/RadioQueue";

interface ModeratorPageProps {}

const ModeratorPage: FC<ModeratorPageProps> = async ({}) => {
  const user = await isAuthUserRadioModerator();

  return (
    <div className="flex w-full flex-col items-start gap-y-2">
      <div className="flex w-full items-center gap-x-1">
        <span className="text-2xl font-bold">Tune In Radio</span>
        <Image
          src="/tower.png"
          alt="radio-tower"
          className="animate-pulse"
          width={50}
          height={50}
        />
        <div className="ml-auto">
          <ListeningCount />
        </div>
      </div>
      <span className="font-sans text-sm font-semibold tracking-tighter text-muted-foreground">
        Your Jockey:
        <span className="ml-2 text-muted-foreground">DJ</span>
      </span>

      <RadioQueue />

      <div className="my-3 w-full "></div>
      <ModeratorPlayer />
      <div className="my-3 w-full border"></div>

      

      <RadioChat isModerator/>
    </div>
  );
};

export default ModeratorPage;
