import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export const GUEST_ID_COOKIE = "scan_guest_id";

/** Reassigns any scans made anonymously (tracked via the guest cookie) to the newly authenticated user. */
export async function migrateGuestScans(userId: string) {
  const cookieStore = await cookies();
  const guestId = cookieStore.get(GUEST_ID_COOKIE)?.value;
  if (!guestId) return;

  await prisma.scan.updateMany({
    where: { guestId, userId: null },
    data: { userId, guestId: null },
  });

  cookieStore.delete(GUEST_ID_COOKIE);
}
