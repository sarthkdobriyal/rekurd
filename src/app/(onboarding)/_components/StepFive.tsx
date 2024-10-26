import { useSession } from "@/app/(main)/SessionProvider";
import LoadingButton from "@/components/LoadingButton";
import { musicalInfoSchema, MusicalInfoValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { updateUserMusicalInfoAction } from "../actions";
import { Brain } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

function StepFive({
  handleNextStep,
  selection,
}: {
  handleNextStep: (step: number) => void;
  selection: string | null;
}) {
  const { user } = useSession();
  const [isPending, startTransition] = useTransition();
  const [tutoring, setTutoring] = useState<boolean>(false);
  const [learning, setLearning] = useState<boolean>(false);

  const form = useForm<MusicalInfoValues>({
    resolver: zodResolver(musicalInfoSchema),
    defaultValues: {
      interestedInLearning: false,
      interestedInTutoring: false,
    },
  });

  async function onSubmit(values: MusicalInfoValues) {
    startTransition(async () => {
      await updateUserMusicalInfoAction(
        {
          ...values,
          interestedInTutoring: tutoring ?? false,
          interestedInLearning: learning ?? false,
        },
        user.id
      );
      handleNextStep(6);
    });
  }

  if (selection !== "fan" && selection !== "musician" && selection !== "beginner") handleNextStep(2);

  return (
    <div className="mt-5 h-full max-w-full md:mx-auto md:w-[60%] md:max-w-[60%] lg:w-[20%] lg:pt-24">
      <div className="mb-7 flex w-[70%] flex-col items-start md:w-full ">
        <Brain
          className="my-5 h-10 w-10 text-muted sm:h-16 sm:w-16 md:h-24 md:w-24"
          style={{ transform: "rotate(20deg)" }}
        />

        <h1 className="text-xl font-bold md:text-4xl">
          {selection === "musician"
            ? "Interested in tutoring with your expertise"
            : selection === "beginner"
            ? "Looking to find tutors or Interested in learning music"
            : selection === "fan"
            ? "Interested in learning music"
            : null}
        </h1>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-5 text-xs md:text-xl"
        >
          {selection === "musician" && (
            <FormField
              control={form.control}
              name="interestedInTutoring"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                  <FormControl>

                    
                    <div className="flex space-y-4 w-full flex-col ">
                      <Button
                        type="button"
                        variant={tutoring === true ? "default" : "outline"}
                        onClick={() => setTutoring(true)}
                      >
                        YES
                      </Button>
                      <Button
                        type="button"
                        variant={tutoring === false ? "default" : "outline"}
                        onClick={() => setTutoring(false)}
                      >
                        NO
                      </Button>
                    </div>
                  </FormControl>
                 
                </FormItem>
              )}
            />
          )}
          {(selection === "beginner" || selection === "fan") && (
            <FormField
              control={form.control}
              name="interestedInLearning"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                  <FormControl>
                    
                    <div className="flex space-y-4 w-full flex-col">
                      <Button
                        type="button"
                        variant={learning === true ? "default" : "outline"}
                        onClick={() => setLearning(true)}
                      >
                        YES
                      </Button>
                      <Button
                        type="button"
                        variant={learning === false ? "default" : "outline"}
                        onClick={() => setLearning(false)}
                      >
                        NO
                      </Button>
                    </div>
                  </FormControl>
                  
                </FormItem>
              )}
            />
          )}

          <LoadingButton
            type="submit"
            loading={isPending}
            className="mx-auto w-[50%]"
          >
            Next
          </LoadingButton>
        </form>
      </Form>
    </div>
  );
}

export default StepFive;