import { ArrowDownOutlined } from "@ant-design/icons";
import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ArrowDown, ArrowRight } from "lucide-react";

type PainPointType = {
  emoji: string;
  title: string;
};

interface Props extends HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  painPoints: PainPointType[];
}

export const LandingPainPoints: React.FC<Props> = ({
  title,
  subtitle,
  painPoints,
  className,
  ...props
}) => {
  return (
    <section className={cn("px-5 py-16", className)} {...props}>
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="text-4xl font-bold lg:text-5xl lg:tracking-tight">
          {title}
        </h2>
        <p className="mb-12 mt-4 text-lg text-slate-600 dark:text-slate-400">
          {subtitle}
        </p>

        <div className="flex  flex-wrap items-center justify-center ">
          {painPoints?.map((painPoint, idx) => (
            <div
              key={painPoint.title}
              className="flex w-full flex-col items-center justify-center gap-3 lg:w-auto lg:flex-row"
            >
              <div className="flex flex-col items-center justify-center">
                <span className="mb-4 text-5xl">{painPoint.emoji}</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-slate-200">
                  {painPoint.title}
                </span>
              </div>
              {idx < painPoints.length - 1 && (
                <div className="flex w-full items-center justify-center my-4 lg:w-auto">
                  <ArrowRight className="hidden lg:flex" />
                  <ArrowDown className="block lg:hidden" />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="pt-20 text-center">
          <div className="flex flex-col items-center">
            <p className="text-lg text-slate-600 dark:text-slate-400">
              <ArrowDownOutlined /> there is an easier way
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
