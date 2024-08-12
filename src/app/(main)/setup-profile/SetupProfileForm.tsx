"use client";

import { useState } from "react";
import { AvatarInput } from "../users/[username]/EditProfileDialog";
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
import { Textarea } from "@/components/ui/textarea";
import LoadingButton from "@/components/LoadingButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateUserProfileSchema,
  UpdateUserProfileValues,
} from "@/lib/validation";
import { useUpdateProfileMutation } from "../users/[username]/mutations";
import { UserData } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface SetupProfileFormProps {
  user: UserData;
}

export default function SetupProfileForm({ user }: SetupProfileFormProps) {
  const form = useForm<UpdateUserProfileValues>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      displayName: user.displayName,
      bio: user.bio || "",
      username: user.username || "",
      email: user.email || "",
      musicalInfo: {
        bio: user.musicalInfo?.bio || "",
        genres: user.musicalInfo?.genres || "",
        instruments: user.musicalInfo?.instruments || "",
        interesetedInLearning: user.musicalInfo?.interesetedInLearning || false,
        interesetedInTutoring: user.musicalInfo?.interesetedInTutoring || false,
        title: user.musicalInfo?.title || "",
        yearsOfExperience: user.musicalInfo?.yearsOfExperience || "",
      },
      userContact: {
        city: user.UserContact?.city || "",
        country: user.UserContact?.country || "India",
        phone: user.UserContact?.phone || "",
        socialLinks: user.UserContact?.socialLinks || {},
      },
    },
  });

  const [croppedAvatar, setCroppedAvatar] = useState<Blob | null>(null);

  const mutation = useUpdateProfileMutation();

   function onSubmit(values: UpdateUserProfileValues) {
    console.log("clicked on submit")
    const newAvatarFile = croppedAvatar
      ? new File([croppedAvatar], `avatar_${user.id}.webp`)
      : undefined;

      console.log(values)

    mutation.mutate(
      {
        values,
        avatar: newAvatarFile,
      },
      {
        onSuccess: () => {
          setCroppedAvatar(null);
        },
      },
    );
  }

  return (
    <div className="flex flex-col gap-4 py-3 pb-24">
      <div className="flex w-full justify-center">
        <AvatarInput
          src={
            croppedAvatar
              ? URL.createObjectURL(croppedAvatar)
              : user.avatarUrl || avatarPlaceholder
          }
          onImageCropped={setCroppedAvatar}
        />
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-3"
        >
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display name</FormLabel>
                <FormControl>
                  <Input placeholder="Your display name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Username must be unique only use alphabets ,numbers, - , _ "
                    {...field}
                  />
                </FormControl>
                {user.username && (
                  <FormDescription>
                    Username must be unique only use alphabets ,numbers, - , _
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Give a snapshot of your musical adventures and passions—what makes your vibe unique!"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is your main bio and will shine across profiles. Make it
                  lively and captivating!
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-2 border-b p-3 text-2xl font-bold">
            Your Musical Journey
            <p className="text-sm font-light text-muted-foreground">
              Helps us match you with the right people
            </p>
          </div>

          <FormField
            control={form.control}
            name="musicalInfo.title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Choose a title that captures your musical vibe
                </FormLabel>
                <FormControl>
                  <Input placeholder="e.g Rapper, Guitarist" {...field} />
                </FormControl>
                <FormDescription>
                  Define your sound—whether as a ‘Guitarist,’ ‘Sonic Alchemist,’
                  ‘Rhythm Architect,’ or something entirely your own.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="musicalInfo.yearsOfExperience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  How long have you been creating musical magic?
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="If you're just starting out, enter 0"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Total years you&apos;ve been crafting your unique sound
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="musicalInfo.primaryInstrument"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  What&apos;s your favorite musical instrument to jam on?
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your top musical instrument here"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  If you&apos;re still finding your groove, let us know which
                  instrument you love and which one you&apos;re excited to try
                  next!
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="musicalInfo.instruments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  What other instruments are you eyeing to jam with?
                </FormLabel>
                <FormControl>
                  <Input placeholder="List here" {...field} />
                </FormControl>
                <FormDescription>
                  Feel free to leave it blank if you&apos;re just jamming with
                  what you have!
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="musicalInfo.genres"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What genres set your soul on fire?</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Drop your favorite genres here, separated by commas"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Help us feel your musical groove!
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="musicalInfo.interestedInTutoring"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Ready to share your musical wisdom?</FormLabel>
                  <FormDescription>
                    Check this if you’re open to tutoring and helping fellow
                    musicians grow!
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="musicalInfo.interestedInLearning"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Excited to learn and jam with others?</FormLabel>
                  <FormDescription>
                    Let us know you’re eager to soak up new skills and vibes
                    from fellow musicians!
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="musicalInfo.bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Share your musical story!</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Give us a glimpse into your musical journey—your jams, experiences, and anything that helps others vibe with you!"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Feel free to <span>@mention</span> other users to connect and
                  collaborate!
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-2 border-b p-3 text-2xl font-bold">
            Your Contact Information
            <p className="text-sm font-light text-muted-foreground">
              Will not be shared with anyone unless approved by you
            </p>
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Your Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="userContact.phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Do not include country code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="userContact.country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="India" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="userContact.city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="For eg- Dehradun" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <LoadingButton
            type="submit"
            loading={mutation.isPending}
            className="mx-auto w-[50%]"
          >
            Save
          </LoadingButton>
        </form>
      </Form>
    </div>
  );
}
