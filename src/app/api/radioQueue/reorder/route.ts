import { isAuthUserRadioModerator } from "@/app/(main)/radio/actions";
import prisma from "@/lib/prisma";

// Define the type for the request body
interface ReorderRequestBody {
  newOrder: { [position: number]: string };
}

//TODO: Error when moving last item to first position in the queue: Deadlock Error

export async function POST(req: Request) {
  try {
    const user = await isAuthUserRadioModerator();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body: ReorderRequestBody = await req.json();

    if (!isValidReorderRequestBody(body)) {
      return new Response("Invalid data format", { status: 400 });
    }

    const { newOrder } = body;

     // Convert newOrder object to an array of song IDs
     const newOrderArray = Object.values(newOrder);

     // Fetch current positions
     const currentPositions = await prisma.radioQueue.findMany({
       where: {
         id: { in: newOrderArray },
       },
       select: {
         id: true,
         position: true,
       },
       orderBy: {
         position: "asc",
       },
     });
 
     // Calculate new positions using floating-point values
     const newPositions = newOrderArray.map((id, index) => {
       const prevPosition = index > 0 ? currentPositions[index - 1].position : 0;
       const nextPosition =
         index < currentPositions.length - 1
           ? currentPositions[index + 1].position
           : currentPositions.length;
       return {
         id,
         position: (prevPosition + nextPosition) / 2,
       };
     });
 
     // Update positions in the database
     await prisma.$transaction(
       newPositions.map(({ id, position }) =>
         prisma.radioQueue.update({
           where: { id },
           data: { position },
         })
       )
     );

    return new Response("Queue order updated successfully", { status: 200 });
  } catch (error) {
    console.log("SERVER ERROR: ", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// Type guard to validate the request body
function isValidReorderRequestBody(body: any): body is ReorderRequestBody {
  if (typeof body !== "object" || body === null) return false;
  if (typeof body.newOrder !== "object" || body.newOrder === null) return false;
  if (Array.isArray(body.newOrder)) return false;

  // Ensure all keys are numbers and values are strings
  for (const key in body.newOrder) {
    if (!Number.isInteger(Number(key))) return false;
    if (typeof body.newOrder[key] !== "string") return false;
  }

  return true;
}

// Type guard to check if the error is a Prisma deadlock error
function isPrismaDeadlockError(error: unknown): error is { code: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: string }).code === "40P01"
  );
}
