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

    // Retry mechanism for handling deadlocks
    const maxRetries = 5;
    let attempt = 0;
    let success = false;

    // Fetch current positions to update in ascending order
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

    // Function to update positions in smaller batches
    const updatePositionsInBatches = async (batchSize: number) => {
      for (let i = 0; i < newOrderArray.length; i += batchSize) {
        const batch = newOrderArray.slice(i, i + batchSize);
        const updatePromises = batch.map((id, index) => {
          const currentPosition = currentPositions.find(
            (item) => item.id === id,
          )?.position;
          return prisma.radioQueue.update({
            where: { id },
            data: { position: i + index },
          });
        });
        await prisma.$transaction(updatePromises);
      }
    };

    while (attempt < maxRetries && !success) {
      try {
        // Check if the last item is being moved to the first position
        const lastItemId = newOrderArray[newOrderArray.length - 1];
        const firstItemId = newOrderArray[0];
        const lastItemCurrentPosition = currentPositions.find(
          (item) => item.id === lastItemId,
        )?.position;

        if (
          lastItemCurrentPosition === newOrderArray.length - 1 &&
          lastItemId === firstItemId
        ) {
          // Move the last item to the first position separately
          await prisma.radioQueue.update({
            where: { id: lastItemId },
            data: { position: 0 },
          });

          // Update the rest of the items
          await updatePositionsInBatches(10);
        } else {
          // Update positions in batches of 10
          await updatePositionsInBatches(10);
        }

        success = true;
      } catch (error) {
        if (isPrismaDeadlockError(error)) {
          // Deadlock detected
          attempt++;
          if (attempt < maxRetries) {
            console.log(
              `Deadlock detected, retrying... (${attempt}/${maxRetries})`,
            );
            await new Promise((resolve) => setTimeout(resolve, 100 * attempt)); // Exponential backoff
          } else {
            throw error;
          }
        } else {
          throw error;
        }
      }
    }

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
