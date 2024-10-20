import loginImage from "@/assets/login-image.jpg";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import GoogleSignInButton from "./google/GoogleSignInButton";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Login",
};

export default function Page() {
  return (
    <main className="flex h-screen w-screen justify-center items-center ">
      {/* <div className="hidden h-full flex-col justify-center gap-4 bg-background pl-60 lg:flex lg:w-1/2 xl:w-2/3">
        <span className="text-9xl font-extralight italic">outsound.</span>
        <p className="text-3xl italic text-gray-500">
          Music app for the future
        </p>
      </div> */}
      <div className="flex w-full items-center justify-center lg:max-w-2xl">
        <div className="flex h-[40rem] max-h-[30rem] md:max-h-[40rem] w-[90%] overflow-hidden rounded-2xl bg-card shadow-sm shadow-muted-foreground   xl:w-[70%] ">
          <div className="w-full space-y-4 md:space-y-8 lg:space-y-10  p-10">
            <div className="space-y-1 text-center">
              <h1 className="text-base md:text-xl lg:text-2xl font-bold">Log in to
                 <span className="italic ml-2 font-superChargedLazer font-extralight">outsound.</span>
                 </h1>
              <p className="text-muted-foreground text-xs">
                A place where  <span className="italic">you</span> can find
                a tune.
              </p>
            </div>
            <div className="space-y-5 justify-between">
            <GoogleSignInButton />
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-muted" />
              <span>OR</span>
              <div className="h-px flex-1 bg-muted" />
            </div>
            <LoginForm />
            <Link href="/signup" className="block text-center text-sm lg:text-xl hover:underline">
              Don&apos;t have an account? Sign up
            </Link>
    
          </div>
          </div>
        </div>
      </div>
    </main>
    
  );
}