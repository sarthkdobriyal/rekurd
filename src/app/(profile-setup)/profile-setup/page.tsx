import { BoltIcon } from "@/app/(main)/_components/dashboard/icons";
import ChoiceCard from "./_components/ChoiceCard";
import { ListenerIcon, MusicianIcon } from "./_components/icons";

export default function ProfileSetupPage() {
  return (
    <div className="relative flex h-full min-h-screen flex-col overflow-hidden">
      <div
        className="pointer-events-none absolute left-1/2 top-[38%] h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[20px]"
        style={{
          background:
            "radial-gradient(circle,rgba(232,98,58,0.14) 0%,rgba(232,98,58,0.04) 40%,transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <header className="relative z-[5] flex items-center justify-between px-5 py-4 sm:px-8 sm:py-[22px]">
        <div className="flex items-center gap-2">
          <BoltIcon className="h-[19px] w-[13px] text-[#e8623a]" />
          <span className="font-display text-lg italic text-white sm:text-[22px]">
            outsound.
          </span>
        </div>
        <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-white/28 sm:text-xs sm:tracking-[0.08em]">
          Set up profile
        </div>
      </header>

      <div className="relative z-[2] flex flex-1 flex-col items-center justify-center px-5 py-6 sm:px-8">
        <div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#e8623a] sm:mb-[18px] sm:gap-[9px] sm:text-[11px]">
          <span className="h-px w-[18px] bg-[rgba(232,98,58,0.4)] sm:w-6" />
          <span>One question</span>
          <span className="h-px w-[18px] bg-[rgba(232,98,58,0.4)] sm:w-6" />
        </div>

        <h1 className="mb-2 max-w-[600px] text-center font-display text-[34px] italic leading-[1.08] text-white sm:mb-3 sm:text-[52px] sm:leading-[1.05]">
          Are you a musician?
        </h1>

        <p className="mb-6 max-w-[440px] px-2 text-center text-[13px] leading-relaxed text-white/52 sm:mb-[42px] sm:px-0 sm:text-[14.5px]">
          Pick the profile that fits you today. You can always change your
          mind later from settings.
        </p>

        <div className="grid w-full max-w-[760px] grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
          <ChoiceCard
            href="#"
            icon={<ListenerIcon />}
            title="Just here to listen"
            description="Scan songs, follow friends, and build a library of finds. A quiet, personal profile."
            bullets={[
              "Save and share your scans",
              "Follow other listeners",
              "Nothing to fill in but a username",
            ]}
            ctaLabel="Continue as listener"
          />
          <ChoiceCard
            href="#"
            accent
            badge="Recommended for artists"
            icon={<MusicianIcon />}
            title="I'm a musician"
            description="Get a musician profile — showcase releases, link streaming platforms, and let listeners follow your sound."
            bullets={[
              "Artist name, genre, and links",
              "Featured track pinned to profile",
              "Show up in Discover for your city",
            ]}
            ctaLabel="Set up musician profile"
          />
        </div>

        <a
          href="#"
          className="mt-6 rounded-full px-4 py-2 text-[13px] text-white/52 underline decoration-white/20 underline-offset-[3px] transition-colors hover:text-white hover:decoration-white/50 sm:mt-[34px]"
        >
          Skip for now
        </a>
        <p className="mt-3 max-w-[380px] px-4 text-center text-[11px] text-white/28 sm:mt-3.5 sm:px-0 sm:text-[11.5px]">
          If you skip, you&apos;ll get the listener profile — you can switch
          to musician anytime from Settings.
        </p>
      </div>
    </div>
  );
}
