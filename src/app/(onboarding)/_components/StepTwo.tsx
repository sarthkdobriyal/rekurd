import React, { useState } from "react";
import { FormStepWrapper } from "./FormStepWrapper";
import { Guitar, HandMetal, Music } from "lucide-react";

const buttonData = [
  {
    label: "No.1 Fan",
    icon: HandMetal,
    selection: "fan",
  },
  {
    label: "Beginner",
    icon: Guitar,
    selection: "beginner",
  },
  {
    label: "Musician",
    icon: Music,
    selection: "musician",
  },
];

function StepTwo({ selection, setSelection }: { selection: string | null; setSelection: (selection: string) => void }) {

  return (
    <div className="flex flex-col items-center justify-center space-y-4 w-full">
      {!selection && (
        <div className="flex flex-col text-center text-5xl gap-y-2">
          <div className="mb-10 flex-col flex gap-y-2">
            <h1 className="text-center">Choose One</h1>
            <p className="text-sm">What describes you best?</p>
          </div>
          <div className="flex gap-x-5 text-base  w-full">
            {buttonData.map((button) => (
              <button
                key={button.selection}
                className="bg-muted rounded-xl aspect-square p-3 md:p-8 flex-1 text-white hover:bg-purple-700 flex justify-center items-center flex-col gap-y-3"
                onClick={() => setSelection(button.selection)}
              >
                <button.icon className="text-muted-foreground w-6 h-6" />
                {button.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {selection === "fan" && (
        <FanForm />
      )}

      {selection === "beginner" && (
       <MusicianForm />
      )}

      {selection === "musician" && (
        <MusicianForm />
      )}
    </div>
  );
}

export default StepTwo;




function FanForm () {
  return <div>
    fan
  </div>
}
function MusicianForm() {
  return <div>
    Musican 
  </div>
}