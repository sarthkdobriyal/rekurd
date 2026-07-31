import { cn } from "@/lib/utils";

interface IconProps {
  className?: string;
}

export function ListenerIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-6 w-6", className)}
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

export function MusicianIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-6 w-6", className)}
    >
      <path d="M12 2v10.5" />
      <circle cx="12" cy="17" r="4" />
      <path d="M12 2c2.5 2 4 4 4 6.5" />
    </svg>
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      className={cn("h-4 w-4", className)}
    >
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}
