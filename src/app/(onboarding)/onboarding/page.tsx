"use client";
import { useUpdateProfileMutation } from "@/app/(main)/users/[username]/mutations";
import { Button } from "@/components/ui/button";
import { UserData } from "@/lib/types";
import { UpdateUserProfileValues } from "@/lib/validation";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import StepOne from "../_components/StepOne";
import StepTwo from "../_components/StepTwo";
import { FormStepWrapper } from "../_components/FormStepWrapper";
import StepThree from "../_components/StepThree";
import StepFour from "../_components/StepFour";
import StepFive from "../_components/StepFive";


export type SelectionTypes = "musician" | "beginner" | "fan" ;

export default function Onboarding({ user }: { user: UserData }) {
  const [step, setStep] = useState(6);
  const [direction, setDirection] = useState(1);
  const [selection, setSelection] = useState<SelectionTypes| null>(null);

  const handleStepSubmit = (data: Partial<UpdateUserProfileValues>) => {};

  const handleNextStep = (nextStep: number) => {
    setDirection(nextStep > step ? 1 : -1);
    setStep(nextStep);
  };
  

  const steps = [
    <FormStepWrapper direction={direction}>
      <StepOne  handleNextStep={handleNextStep}/>
    </FormStepWrapper>,
    <FormStepWrapper direction={direction}>
      <StepTwo selection={selection} setSelection={setSelection} handleNextStep={handleNextStep}/>
    </FormStepWrapper>,
    <FormStepWrapper direction={direction}>
      <StepThree 
       handleNextStep={handleNextStep}
      />
    </FormStepWrapper>,
    <FormStepWrapper direction={direction}>
      <StepFour
      selection={selection}
       handleNextStep={handleNextStep}
      />
    </FormStepWrapper>,
    <FormStepWrapper direction={direction}>
      <StepFive
      selection={selection}
       handleNextStep={handleNextStep}
      />
    </FormStepWrapper>,
  ];


  console.log(selection)

  return (
    <div className="flex h-full w-full flex-col overflow-hidden  text-xs">
      <AnimatePresence mode="wait" key={"step-" + step}>
        {steps[step - 1]}
      </AnimatePresence>

      <div className="flex w-full  justify-center gap-2  p-4">
        {steps.map((_, i) => (
          <Button
            key={i}
            variant={step === i + 1 ? "default" : "outline"}
            className="h-2 w-8 rounded-full p-0"
            onClick={() => {
              setDirection(i + 1 > step ? 1 : -1);
              setStep(i + 1);
            }}
          />
        ))}
      </div>
    </div>
  );
}
