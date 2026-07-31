import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import MenuBar from "./MenuBar";
import Navbar from "./Navbar";
import SessionProvider from "./SessionProvider";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  if (!session.user) redirect("/scanner");


  return (
    <SessionProvider value={session}>
      <div className="relative flex min-h-screen flex-col bg-black">
        <Navbar />
        <main className="flex-1 pb-16 sm:pb-0">{children}</main>
        <MenuBar className="fixed bottom-0 z-20 flex w-full border-t border-white/[0.07] bg-[#080808]/95 py-1.5 backdrop-blur-md sm:hidden" />
        {/* <Link href='/ai-chatbot' >
          <ChatBotAvatar />
        </Link> */}
      </div>
    </SessionProvider>
  );
}
