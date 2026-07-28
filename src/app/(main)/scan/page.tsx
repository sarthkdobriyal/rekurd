import { FC } from "react";
import ScanButton from "./_components/ScanButton";

const ScanPage: FC = () => {
  return (
    <div className="w-full min-w-0 space-y-5">
      <div className="rounded-2xl bg-card p-5 shadow-sm">
        <h1 className="text-center text-2xl font-bold">Scan a Song</h1>
        <p className="text-center text-sm text-muted-foreground">
          Hold your device near the music and we&apos;ll identify it in
          seconds.
        </p>
      </div>
      <ScanButton />
    </div>
  );
};

export default ScanPage;
