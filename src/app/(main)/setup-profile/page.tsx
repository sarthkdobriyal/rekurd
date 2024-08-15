import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import SetupProfileForm from "./SetupProfileForm";


export default async function SetupProfilePage() {

    const {user:loggedInUser} = await validateRequest()

    if(!loggedInUser){
      return null
    }


    const user = await prisma.user.findFirst({
      where: {
        id: loggedInUser.id,
      },
      select: getUserDataSelect(loggedInUser.id, true)
    });


    if(!user){
      return null
    }
      

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