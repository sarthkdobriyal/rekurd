import LoadingButton from "@/components/LoadingButton";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { musicalInfoSchema, MusicalInfoValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileMusic } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { updateUserMusicalInfoAction } from "../actions";
import { useSession } from "@/app/(main)/SessionProvider";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function StepFour({
  handleNextStep,
  selection,
}: {
  handleNextStep: (step: number) => void;
  selection: string | null;
}) {
  const { user } = useSession();

  const form = useForm<MusicalInfoValues>({
    resolver: zodResolver(musicalInfoSchema),
    defaultValues: {
      bio: "",
    },
  });

  const [isPending, startTransition] = useTransition();

  async function onSubmit(values: MusicalInfoValues) {
    startTransition(async () => {
      await updateUserMusicalInfoAction(
        {
          ...values,
        },
        user.id,
        5
      );
      handleNextStep(5);
    });
  }

  if(selection === 'fan')  handleNextStep(5)

  return (
    <div className="mt-5 h-full max-w-full md:mx-auto md:w-[60%] md:max-w-[60%] lg:w-[20%]">
      <div className="mb-7 flex w-[70%] flex-col items-start md:w-full">
        <FileMusic
          className="my-5 h-10 w-10 text-muted sm:h-16 sm:w-16 md:h-24 md:w-24"
          style={{ transform: "rotate(20deg)" }}
        />

        <h1 className="text-xl font-bold md:text-4xl">
          {
            selection === "musician" ? "Share your musical journey" : "Tell us about your musical interests"
          }
        </h1>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-5 text-xs md:text-xl"
        >
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder={`${selection === 'musician' ? "Give us a glimpse into your musical journey—your jams, experiences, and anything that helps others vibe with you!" :  "What are your favorite genres, artists, or songs? Share your musical interests and let others know what you love!" + " Start Typing..."}`}
                    className="resize-none h-[15rem]"
                    {...field}
                  />
                </FormControl>
                {/* <FormDescription>
                  Feel free to <span>@mention</span> other users to connect and
                  collaborate!
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
            <Button
                variant={"outline"}
                className="w-[50%] mx-auto"
                onClick={
                    () => {
                        handleNextStep(5)
                    }
                }
            >
                Do it later
            </Button>

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

export default StepFour;
