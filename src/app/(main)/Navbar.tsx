import UserButton from "@/components/UserButton";
import { User } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-card shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-5 px-5 py-3">
        <Link href='/'>
        <span className="text-3xl font-light italic">reKurd.</span>
        </Link>
        <UserButton />
      </div>
    </header>
  );
}
