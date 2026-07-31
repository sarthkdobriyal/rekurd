import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import SessionProvider from "../(main)/SessionProvider";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  if (!session.user) redirect("/scanner");

  return (
    <SessionProvider value={session}>
      <div className="h-screen w-screen max-w-screen max-h-screen overflow-hidden bg-black">
        {children}
      </div>
    </SessionProvider>
  );
}
