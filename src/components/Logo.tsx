import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props {}

export const Logo: React.FC<Props> = ({}) => {
  const router = useRouter();

  const goTo = (url: string) => {
    router.push(url);
  };

  return (
    <div className="font-superChargedLazer text-3xl font-bold italic tracking-tighter">
      outsound.
    </div>
  );
};
