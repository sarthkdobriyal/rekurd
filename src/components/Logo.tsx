"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props {}

export const Logo: React.FC<Props> = ({}) => {
  const router = useRouter();

  const goTo = (url: string) => {
    router.push(url);
  };

  return (
    <div className="font-superChargedLazer flex items-center">
      <Image 
      src={'/logo.ico'}
      alt="outsound logo"
      width={10}
      height={10}
      className="w-4 h-4 "
      />
      <span className="text-xl tracking-tight">outsound.</span>
    </div>
  );
};
