import { validateRequest } from "@/auth";
import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export const getLoggedInUserPages = async (
    req: NextApiRequest,
    res: NextApiResponse
  ): Promise<User| null> => {
    
    const { user } = await validateRequest()
  
    if (!user) {
      console.log('NO USER', user);
      return null;
    }
  
    return user ? user as User: null;
  };