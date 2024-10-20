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
    <main className="flex h-screen w-screen justify-center items-center p-5">
      {/* <div className="hidden h-full flex-col justify-center gap-4 bg-background pl-60 lg:flex lg:w-1/2 xl:w-2/3">
        <span className="text-9xl font-extralight italic">outsound.</span>
        <p className="text-3xl italic text-gray-500">
          Music app for the future
        </p>
      </div> */}
      <div className="flex w-full items-center justify-center lg:w-1/2 xl:w-1/3">
        <div className="flex h-[40rem] max-h-[40rem] w-[90%] overflow-hidden rounded-2xl bg-card shadow-sm shadow-muted-foreground md:w-[70%] lg:w-[]">
          <div className="w-full space-y-10  p-10">
            <div className="space-y-1 text-center">
              <h1 className="text-3xl font-bold">Log in to <span className="italic font-extralight">outsound.</span></h1>
              <p className="text-muted-foreground">
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
            <Link href="/signup" className="block text-center hover:underline">
              Don&apos;t have an account? Sign up
            </Link>
    
          </div>
          </div>
        </div>
      </div>
    </main>
    
  );
}