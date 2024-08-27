import Image from "next/image";
import { HTMLAttributes } from "react";

type LogoType = {
  url: string;
};

interface Props extends HTMLAttributes<HTMLElement> {
  title: string;
  logos: LogoType[];
}

export const LandingSocialProof: React.FC<Props> = ({ logos }) => {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-slate-600 dark:text-slate-400">
          Featured on
        </h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-8 md:gap-20">
          {logos.map((logo, idx) => (
            <div
              key={`logo-${idx}`}
              className="rounded-full overflow-hidden"
            >
              <Image
                alt="social-proof"
                className="aspect-square"
                src={logo.url}
                width={40}
                height={40}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
