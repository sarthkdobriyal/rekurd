import { useSession } from "@/app/(main)/SessionProvider";
import kyInstance from "@/lib/ky";
import { musicalInfoSchema, MusicalInfoValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Genre } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { updateUserMusicalInfoAction } from "../actions";
import { Dna, Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/MultiSelector";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";

function StepThree({
  handleNextStep,
}: {
  handleNextStep: (step: number) => void;
}) {
  const { user } = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<MusicalInfoValues>({
    resolver: zodResolver(musicalInfoSchema),
    defaultValues: {
      genres: [],
    },
  });

  const {
    data,
    isLoading: isLoadinggenres,
    isError,
  } = useQuery({
    queryKey: ["genres"],
    queryFn: () =>
      kyInstance.get(`/api/genres`).json<{
        genres: Genre[];
        count: number;
      }>(),
    staleTime: Infinity,
  });

  const genres = data?.genres;

  async function onSubmit(values: MusicalInfoValues) {
    startTransition(async () => {
      await updateUserMusicalInfoAction(
        {
          ...values,
        },
        user.id,
      );
      handleNextStep(4);
    });
  }

  const handleGenreClick = (e: React.MouseEvent, subgenre: string) => {
    e.preventDefault();
    const currentValues = form.getValues("genres");
    if (currentValues?.includes(subgenre)) {
      form.setValue(
        "genres",
        currentValues.filter((value) => value !== subgenre),
      );
    } else {
      form.setValue("genres", [...currentValues!, subgenre]);
    }

    console.log(form.getValues("genres"));
  };

  const createStaggeredRows = (genres: Genre[] | undefined) => {
    if (!genres) return [];
    const rows: Genre[][] = [];
    let currentIndex = 0;

    while (currentIndex < genres.length) {
      // Determine number of items for this row based on position
      let itemsInThisRow: number;
      const rowPosition = rows.length % 3; // Create a pattern every 3 rows

      switch (rowPosition) {
        case 0: // First row in pattern
          itemsInThisRow = 3;
          break;
        case 1: // Second row in pattern
          itemsInThisRow = 4;
          break;
        case 2: // Third row in pattern
          itemsInThisRow = 3;
          break;
        default:
          itemsInThisRow = 4;
      }

      // Get items for this row
      const row = genres.slice(currentIndex, currentIndex + itemsInThisRow);
      if (row.length > 0) {
        // Only add row if it has items
        rows.push(row);
      }
      currentIndex += itemsInThisRow;
    }

    return rows;
  };

  return (
    <div className="max-w-full h-full md:w-[60%] md:max-w-[60%] lg:w-[20%] mt-5  md:mx-auto">
      <div className="mb-7 flex w-[70%] flex-col items-start md:w-full ">
        <Dna
          className="my-5 h-10 w-10  sm:h-16 sm:w-16 text-muted md:h-24 md:w-24"
          style={{ transform: "rotate(20deg)" }}
        />

        <h1 className="text-xl font-bold  md:text-4xl">
          Genres you love are
        </h1>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-5 text-xs md:text-xl"
        >
          <FormField
            control={form.control}
            name="genres"
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
                          placeholder={`${isLoadinggenres ? "" : "Search genres"}`}
                        />
                        {isLoadinggenres && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                      </MultiSelectorTrigger>
                      <MultiSelectorContent>
                        <MultiSelectorList>
                          {genres?.map((option) => (
                            <MultiSelectorItem
                              key={option.id}
                              value={option.subgenre}
                            >
                              {option.subgenre}
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

          <span>or choose from here:</span>

          <div className=" relative h-[15rem] md:h-[25rem] w-full overflow-x-auto  lg:w-[175%] ">
            <div className="absolute inset-0 scrollbar-hide overflow-x-auto overflow-y-auto scroll-smooth">
              <div className=" w-fit flex h-full  min-w-full flex-col items-center   py-2 pr-10">
                {createStaggeredRows(genres).map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className={`mb-3 flex justify-start gap-3 transition-all duration-200 ${rowIndex % 3 === 0 ? "ml-1" : ""} ${rowIndex % 3 === 1 ? "ml-4" : ""}`}
                    style={{
                      width: "max-content",
                      minWidth: "100%",
                    }}
                  >
                    {row.map((genre) => (
                      <Button
                        key={genre.id}
                        className={`whitespace-nowrap rounded-xl bg-card px-4 py-2 text-sm transition-all duration-200 hover:scale-105 ${
                          form.getValues("genres")?.includes(genre.subgenre)
                            ? "bg-primary text-white"
                            : ""
                        }`}
                        onClick={(e) => handleGenreClick(e, genre.subgenre)}
                      >
                        {genre.subgenre}
                      </Button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

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

export default StepThree;
