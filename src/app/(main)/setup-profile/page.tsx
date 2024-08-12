import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import { cache } from "react";
import EditProfileDialog from "../users/[username]/EditProfileDialog";
import SetupProfileForm from "./SetupProfileForm";

export default async function SetupProfilePage() {

    const loggedInUser = await validateRequest()

    const getUser = cache(async (loggedInUserId: string) => {
        const user = await prisma.user.findFirst({
          where: {
            id: loggedInUserId,
          },
          select: getUserDataSelect(loggedInUserId, true)
        });
      
        if (!user) notFound();
      
        return user;
      });


      const user = await getUser(loggedInUser.id);

      

    return (
        <div className="h-full w-full ">
        <div className=" border-b p-3 mb-5 flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Help us know you better</h1>
          <p className="font-light text-sm text-muted-foreground">
                    This will personalize your experience on the app
                </p>
        </div>
        <SetupProfileForm user={user} />
        </div>
    )
}