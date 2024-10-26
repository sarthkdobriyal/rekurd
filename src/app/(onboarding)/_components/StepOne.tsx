"use client"
import React, { useState, useTransition } from 'react'
import { FormStepWrapper } from './FormStepWrapper'
import { useSession } from '@/app/(main)/SessionProvider'
import LoadingButton from '@/components/LoadingButton'
import {  useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateUserInfoSchema, updateUserInfoValues, updateUserProfileSchema, UpdateUserProfileValues } from '@/lib/validation'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { AvatarInput } from '@/app/(main)/users/[username]/EditProfileDialog'
import avatarPlaceholder from '@/assets/avatar-placeholder.png';
import { useUploadThing } from '@/lib/uploadthing'
import { updateUserAction } from '../actions'



function StepOne({ handleNextStep }: { handleNextStep: (step: number) => void }) {

  const { user } = useSession()
  const { startUpload, isUploading  } = useUploadThing("avatar");
  const [croppedAvatar, setCroppedAvatar] = useState<Blob | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<updateUserInfoValues>({
    resolver: zodResolver(updateUserInfoSchema),
    defaultValues: {
      displayName: user.displayName || "",
      username: user.username || "",
    },
  });

  async function onSubmit(values: updateUserInfoValues) {
    const newAvatarFile = croppedAvatar
      ? new File([croppedAvatar], `avatar_${user.id}.webp`)
      : undefined;

    // Check if values have changed
    const valuesChanged = values.displayName !== user.displayName || values.username !== user.username || newAvatarFile;

    if (!valuesChanged) {
      // If no values have changed, move to the next step
      handleNextStep(2);
      return;
    }

    if (newAvatarFile) {
      await startUpload([newAvatarFile]);
    }

    startTransition(async () => {
      await updateUserAction({
        ...values,
      }, user.id);
      handleNextStep(2);
    });
  }



  return (
   <div className="flex flex-col gap-4 py-3 my-auto  ">
    <h1 className="font-bold text-4xl mb-16 ">
      {
        user.username ? "Verify your details" : "Help us know you better"
      }
    </h1>
      <div className="flex flex-col items-center gap-y-3 w-full justify-center">
        <AvatarInput
          src={
            croppedAvatar
              ? URL.createObjectURL(croppedAvatar)
              : user.avatarUrl || avatarPlaceholder
          }
          onImageCropped={setCroppedAvatar}
        />
        {
          !user.avatarUrl && <p>Choose a pic</p>
        }
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-3 "
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
                    Unique and use alphabets ,numbers, - , _
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          

          <LoadingButton
            type="submit"
            loading={isPending || isUploading}
            className="mx-auto w-[50%]"
          >
            Next
          </LoadingButton>
        </form>
      </Form>
    </div>
  )
}

export default StepOne