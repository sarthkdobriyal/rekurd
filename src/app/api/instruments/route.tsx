import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { Instrument } from "@prisma/client";
import { count } from "console";

export async function GET(req: Request) {

    const {user} = await validateRequest()

    // get all the insqtruments from the database using prisma
    const instruments = await prisma.instrument.findMany()
    const data: {
        instruments: Instrument[],
        count: number
    } = {
        instruments: instruments,
        count: instruments.length
    }

    // return the instruments as a json response
    return Response.json(data)

}