import { useSession } from "@/app/(main)/SessionProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { updateUserLocationAction, updateUserMusicalInfoAction } from "../actions";
import { MapPin, MapPinCheckInside } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { userContactSchema, UserContactValues } from "@/lib/validation";
import kyInstance from "@/lib/ky";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

const GEOCODING_API = process.env.NEXT_PUBLIC_GEOCODING_API;

type GeoapifyResponse = {
  features: Array<{
    properties: {
      city: string;
      country: string;
    };
  }>;
};

function StepSix({
  handleNextStep,
  selection,
}: {
  handleNextStep: (step: number) => void;
  selection: string | null;
}) {
  const { user } = useSession();
  const [isPending, startTransition] = useTransition();
  const [locationSelected, setLocationSelected] = useState<boolean>(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [coords, setCoords] = useState<GeolocationCoordinates | null>(null);

  const form = useForm<UserContactValues>({
    resolver: zodResolver(userContactSchema),
    defaultValues: {
      city: "",
      country: "",
    },
  });

  const { toast } = useToast();

  const getCityUsingLocation = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    setIsLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCoords(position.coords);
          try {
            const response = await kyInstance
              .get(
                `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${GEOCODING_API}`,
              )
              .json<GeoapifyResponse>();
            const city = response.features[0].properties.city;
            const country = response.features[0].properties.country;
            form.setValue("city", city);
            form.setValue("country", country);
          } catch (error) {
            console.error("Error fetching city:", error);
            toast({
              title: "Error fetching city",
              description: "Please click again to get a response.",
              variant: "destructive",
            });
          } finally {
            setLocationSelected(true);
            setIsLocationLoading(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast({
            title: "Error fetching city",
            description: "Please enter your city manually.",
            variant: "destructive",
          });
          setIsLocationLoading(false);
        },
      );
    } else {
      alert(
        "Geolocation is not supported by this browser. Please enter your city manually.",
      );
      setLocationSelected(false);
      setIsLocationLoading(false);
    }
  };

  async function onSubmit(values: UserContactValues) {
    if(!locationSelected) return toast({
        variant: "destructive",
        description: "Please allow location permission first",
    })
    startTransition(async () => {
        await updateUserLocationAction(values, coords!, user.id);
        handleNextStep(-1);
      });
  }

  return (
    <div className="mt-5 h-full max-w-full md:mx-auto md:w-[60%] md:max-w-[60%] lg:w-[20%] lg:pt-24 my-auto">
      <div className="mb-7 flex w-full  pt-12 flex-col items-center md:w-full">
        {
            locationSelected ? <MapPinCheckInside 
            className="my-5 h-20 w-20 text-muted sm:h-16 sm:w-16 md:h-24 md:w-24"
            style={{ transform: "rotate(20deg)" }}
          /> : <MapPin
          className="my-5 h-20 w-20 text-muted sm:h-16 sm:w-16 md:h-24 md:w-24"
          style={{ transform: "rotate(20deg)" }}
        />
        }

        <div className="flex flex-col space-y-3 md:space-y-6 text-center mx-auto w-full ">
          <h1 className="text-xl font-bold md:text-5xl">
            Allow us to get your location
          </h1>
          <span className="prose-sm text-xs md:text-base text-muted-foreground">
            We use this to recommend you other artists and people around you to
            connect
          </span>
        </div>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-5 text-xs md:text-xl"
        >
          {
            locationSelected && <>
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
  
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </>
          }

          {!locationSelected && (
            <LoadingButton
              onClick={(e) => getCityUsingLocation(e)}
              loading={isLocationLoading}
              className="mx-auto my-8 bg-primary"
            >
              Allow Location Permission
            </LoadingButton>
          )}

          {locationSelected && (
            <LoadingButton
              type="submit"
              loading={isPending}
              className="mx-auto w-[50%]"
            >
              Next
            </LoadingButton>
          )}
        </form>
      </Form>
    </div>
  );
}

export default StepSix;
