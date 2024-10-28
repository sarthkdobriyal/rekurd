import { useTransition } from "react";
import { Guitar, HandMetal, Loader2, Music } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/LoadingButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "@/app/(main)/SessionProvider";
import { musicalInfoSchema, MusicalInfoValues } from "@/lib/validation";
import { updateUserMusicalInfoAction } from "../actions";
import kyInstance from "@/lib/ky";
import { useQuery } from "@tanstack/react-query";
import { Instrument } from "@prisma/client";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/MultiSelector";
import { SelectionTypes } from "@/lib/types";

const buttonData = [
  {
    label: "Fan",
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

function StepTwo({
  selection,
  setSelection,
  handleNextStep,
}: {
  selection: string | null;
  setSelection: (selection: SelectionTypes) => void;
  handleNextStep: (step: number) => void;
}) {
  return (
    <div className="my-auto flex w-full flex-col items-center justify-center space-y-4">
      {!selection && (
        <div className="flex flex-col gap-y-2 text-center text-5xl">
          <div className="mb-10 flex flex-col gap-y-2">
            <h1 className="text-center">You are a</h1>
            <p className="text-sm">What describes you best?</p>
          </div>
          <div className="flex w-full gap-x-5 text-base md:text-xl">
            {buttonData.map((button) => (
              <button
                key={button.selection}
                className="flex aspect-square h-24 w-24 flex-1 flex-col items-center justify-center gap-y-3 rounded-xl border bg-muted p-5 text-white hover:bg-purple-700 md:h-52 md:w-52 md:p-8"
                onClick={() => {
                  if (button.selection === "fan") {
                    setSelection("fan");
                    handleNextStep(3);
                  } else {
                    setSelection(
                      button.selection === "musician"
                        ? "musician"
                        : button.selection === "beginner"
                          ? "beginner"
                          : "fan",
                    );
                  }
                }}
              >
                <button.icon className="h-10 w-10 text-muted-foreground" />
                {button.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {selection === "beginner" && (
        <BeginnerForm handleNextStep={handleNextStep} />
      )}

      {selection === "musician" && (
        <MusicianForm handleNextStep={handleNextStep} />
      )}
    </div>
  );
}

export default StepTwo;

function MusicianForm({
  handleNextStep,
}: {
  handleNextStep: (step: number) => void;
}) {
  const { user } = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<MusicalInfoValues>({
    resolver: zodResolver(musicalInfoSchema),
    defaultValues: {
      instruments: [],
    },
  });

  const {
    data,
    isLoading: isLoadingInstruments,
    isError,
  } = useQuery({
    queryKey: ["instruments"],
    queryFn: () =>
      kyInstance.get(`/api/instruments`).json<{
        instruments: Instrument[];
        count: number;
      }>(),
    staleTime: Infinity,
  });

  const instruments = data?.instruments;

  async function onSubmit(values: MusicalInfoValues) {
    startTransition(async () => {
      await updateUserMusicalInfoAction(
        {
          ...values,
        },
        user.id,
        3,
      );
      handleNextStep(3);
    });
  }

  return (
    <div className="">
      <div className="mb-7 flex w-[70%] flex-col items-start md:w-full md:items-center">
        <Music
          className="my-5 h-16 w-16 text-muted md:h-24 md:w-24"
          style={{ transform: "rotate(20deg)" }}
        />

        <h1 className="text-3xl font-bold md:my-16 md:text-5xl">
          What&apos;s your experience
        </h1>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-5 text-xs md:text-xl"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex w-full items-center">
                <FormLabel className="w-full">Your Stage Name</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="yearsOfExperience"
            render={({ field }) => (
              <FormItem className="flex items-center text-xs">
                <FormLabel className="w-full leading-4">
                  Years of experience
                </FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                  {}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="instruments"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>What instruments do you play?</FormLabel>
                  <FormControl>
                    <MultiSelector
                      onValuesChange={field.onChange}
                      values={field.value?.map((instrument) => instrument)!}
                    >
                      <MultiSelectorTrigger>
                        <MultiSelectorInput
                          placeholder={`${isLoadingInstruments ? "" : "Search instruments"}`}
                        />
                        {isLoadingInstruments && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                      </MultiSelectorTrigger>
                      <MultiSelectorContent>
                        <MultiSelectorList>
                          {instruments?.map((option) => (
                            <MultiSelectorItem
                              key={option.id}
                              value={option.name}
                            >
                              {option.name}
                            </MultiSelectorItem>
                          ))}
                        </MultiSelectorList>
                      </MultiSelectorContent>
                    </MultiSelector>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

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

function BeginnerForm({
  handleNextStep,
}: {
  handleNextStep: (step: number) => void;
}) {
  const { user } = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<MusicalInfoValues>({
    resolver: zodResolver(musicalInfoSchema),
    defaultValues: {
      instruments: [],
    },
  });

  const {
    data,
    isLoading: isLoadingInstruments,
    isError,
  } = useQuery({
    queryKey: ["instruments"],
    queryFn: () =>
      kyInstance.get(`/api/instruments`).json<{
        instruments: Instrument[];
        count: number;
      }>(),
    staleTime: Infinity,
  });

  const instruments = data?.instruments;

  async function onSubmit(values: MusicalInfoValues) {
    startTransition(async () => {
      await updateUserMusicalInfoAction(
        {
          ...values,
        },
        user.id,
        3,
      );
      handleNextStep(3);
    });
  }

  return (
    <div className="md:w-[60%] md:max-w-[60%] lg:w-[20%]">
      <div className="flex w-[70%] flex-col items-start md:w-full">
        <Music
          className="h-16 w-16 text-muted md:h-24 md:w-24"
          style={{ transform: "rotate(20deg)" }}
        />

        <h1 className="my-5 text-3xl font-bold md:text-5xl">
          Instruments you play or like
        </h1>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-5 text-xs md:text-xl"
        >
          <FormField
            control={form.control}
            name="instruments"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormControl>
                    <MultiSelector
                      onValuesChange={field.onChange}
                      values={field.value?.map((instrument) => instrument)!}
                    >
                      <MultiSelectorTrigger>
                        <MultiSelectorInput
                          placeholder={`${isLoadingInstruments ? "" : "Search instruments"}`}
                        />
                        {isLoadingInstruments && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                      </MultiSelectorTrigger>
                      <MultiSelectorContent>
                        <MultiSelectorList>
                          {instruments?.map((option) => (
                            <MultiSelectorItem
                              key={option.id}
                              value={option.name}
                            >
                              {option.name}
                            </MultiSelectorItem>
                          ))}
                        </MultiSelectorList>
                      </MultiSelectorContent>
                    </MultiSelector>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

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
