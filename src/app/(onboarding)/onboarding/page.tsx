"use client";
import { Button } from "@/components/ui/button";
import { SelectionTypes, UserData } from "@/lib/types";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import StepOne from "../_components/StepOne";
import StepTwo from "../_components/StepTwo";
import { FormStepWrapper } from "../_components/FormStepWrapper";
import StepThree from "../_components/StepThree";
import StepFour from "../_components/StepFour";
import StepFive from "../_components/StepFive";
import StepSix from "../_components/StepSix";
import { updateUserOnboarding } from "../actions";
import { redirect } from "next/navigation";





export default function Onboarding() {
  


  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [selection, setSelection] = useState<SelectionTypes| null>(null);


  const handleNextStep = (nextStep: number) => {
    if(nextStep === -1) {
      updateUserOnboarding(-1)
      redirect("/")
    }
    setDirection(nextStep > step ? 1 : -1);
    setStep(nextStep);
  };
  

  const steps = [
    <FormStepWrapper key={1} direction={direction}>
      <StepOne  handleNextStep={handleNextStep}/>
    </FormStepWrapper>,
    <FormStepWrapper key={2} direction={direction}>
      <StepTwo selection={selection} setSelection={setSelection} handleNextStep={handleNextStep}/>
    </FormStepWrapper>,
    <FormStepWrapper key={3} direction={direction}>
      <StepThree 
       handleNextStep={handleNextStep}
      />
    </FormStepWrapper>,
    <FormStepWrapper key={4} direction={direction}>
      <StepFour
      selection={selection}
       handleNextStep={handleNextStep}
      />
    </FormStepWrapper>,
    <FormStepWrapper key={5} direction={direction}>
      <StepFive
      selection={selection}
       handleNextStep={handleNextStep}
      />
    </FormStepWrapper>,
    <FormStepWrapper key={6} direction={direction}>
      <StepSix
      selection={selection}
       handleNextStep={handleNextStep}
      />
    </FormStepWrapper>,
  ];



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
