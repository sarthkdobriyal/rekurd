import ScanGrid, { ScanTile } from "@/app/(main)/_components/profile/ScanGrid";
import {
  PlayIcon,
  SpotifyIcon,
  YouTubeIcon,
  InstagramIcon,
  PinIcon,
} from "@/app/(main)/_components/dashboard/icons";

// TODO(backend): replace with real data once these endpoints exist:
// - GET /api/users/:username (musician profile: stage name, badge, instruments, genres, city, bio, links)
// - GET /api/clips/by-user/:id (portfolio clips)
// - GET /api/scans/by-user/:id (scan grid)
// - GET /api/looking-for/by-user/:id (active looking-for post, if any)
interface MusicianProfile {
  stageName: string;
  username: string;
  initials: string;
  avatarGradient: string;
  avatarColor: string;
  city: string;
  bio: string;
  instruments: string[];
  genres: string[];
  scanCount: number;
  connectionCount: number;
  links: { platform: "spotify" | "youtube" | "instagram"; href: string }[];
  lookingFor?: string;
}

interface Clip {
  id: string;
  title: string;
  duration: string;
  artGradient: string;
  emoji: string;
}

const profile: MusicianProfile = {
  stageName: "Nova Sol",
  username: "mayakumar",
  initials: "NS",
  avatarGradient: "linear-gradient(135deg,#3d180a,#1a0a08)",
  avatarColor: "#e8623a",
  city: "Brooklyn, NY",
  bio: "Guitarist & producer blending psych-rock textures with lo-fi warmth. Currently tracking a debut EP.",
  instruments: ["Guitar", "Synth", "Vocals"],
  genres: ["Psych-rock", "Lo-fi", "Shoegaze"],
  scanCount: 34,
  connectionCount: 128,
  links: [
    { platform: "spotify", href: "#" },
    { platform: "youtube", href: "#" },
    { platform: "instagram", href: "#" },
  ],
  lookingFor: "Drummer for a psych band — gigging around BK this fall",
};

const clips: Clip[] = [
  { id: "c1", title: "Live at Union Pool", duration: "0:48", artGradient: "linear-gradient(135deg,#1a0a08,#3d180a)", emoji: "🎸" },
  { id: "c2", title: "EP demo — track 2", duration: "1:02", artGradient: "linear-gradient(135deg,#180a18,#3d0a3d)", emoji: "🎹" },
  { id: "c3", title: "Rooftop session", duration: "0:36", artGradient: "linear-gradient(135deg,#0a1818,#0a3d3d)", emoji: "🎤" },
  { id: "c4", title: "Pedalboard test", duration: "0:22", artGradient: "linear-gradient(135deg,#0a180a,#183d0a)", emoji: "🎛️" },
];

const scans: ScanTile[] = [
  { id: "s1", title: "Something in the Way", artist: "Nirvana", artGradient: "linear-gradient(135deg,#1a0a08,#3d180a)", emoji: "🎸", timeAgo: "2h" },
  { id: "s2", title: "Only Shallow", artist: "My Bloody Valentine", artGradient: "linear-gradient(135deg,#080a1a,#0a183d)", emoji: "🎧", timeAgo: "5h" },
  { id: "s3", title: "Feel Good Inc.", artist: "Gorillaz", artGradient: "linear-gradient(135deg,#0a180a,#183d0a)", emoji: "🎵", timeAgo: "1d" },
  { id: "s4", title: "The Rat", artist: "The Walkmen", artGradient: "linear-gradient(135deg,#180a0a,#3d0808)", emoji: "🥁", timeAgo: "2d" },
  { id: "s5", title: "Ultralight Beam", artist: "Kanye West", artGradient: "linear-gradient(135deg,#180a18,#3d0a3d)", emoji: "🎹", timeAgo: "3d" },
  { id: "s6", title: "Redbone", artist: "Childish Gambino", artGradient: "linear-gradient(135deg,#1a1808,#3d3a0a)", emoji: "🎸", timeAgo: "4d" },
];

const linkIcon = {
  spotify: SpotifyIcon,
  youtube: YouTubeIcon,
  instagram: InstagramIcon,
};

function Chip({ label, accent }: { label: string; accent?: boolean }) {
  return (
    <span
      className={
        accent
          ? "rounded-full border border-[rgba(232,98,58,0.28)] bg-[rgba(232,98,58,0.1)] px-3 py-1 text-[11px] font-medium text-[#e8623a]"
          : "rounded-full border border-white/[0.1] bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-white/70"
      }
    >
      {label}
    </span>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center sm:items-start">
      <span className="font-display text-2xl italic leading-none text-white sm:text-3xl">
        {value}
      </span>
      <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-white/40 sm:text-[11px]">
        {label}
      </span>
    </div>
  );
}

export default function MusicianPreviewPage() {
  return (
    <div className="mx-auto w-full max-w-[1040px] px-4 pb-24 pt-6 sm:px-6 sm:pt-10">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
        <div
          className="relative flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full border border-[rgba(232,98,58,0.3)] font-display text-3xl italic sm:h-28 sm:w-28 sm:text-4xl"
          style={{ background: profile.avatarGradient, color: profile.avatarColor }}
        >
          {profile.initials}
        </div>

        <div className="flex flex-1 flex-col items-center sm:items-start">
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:justify-start">
            <h1 className="font-display text-[30px] italic leading-tight text-white sm:text-[38px]">
              {profile.stageName}
            </h1>
            <span className="rounded-full border border-[rgba(232,98,58,0.3)] bg-[rgba(232,98,58,0.12)] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#e8623a]">
              Musician
            </span>
          </div>
          <span className="text-sm text-white/40">
            @{profile.username} · {profile.city}
          </span>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            {profile.instruments.map((i) => (
              <Chip key={i} label={i} accent />
            ))}
            {profile.genres.map((g) => (
              <Chip key={g} label={g} />
            ))}
          </div>

          <p className="mt-4 max-w-[520px] text-center text-[13.5px] leading-relaxed text-white/60 sm:text-left">
            {profile.bio}
          </p>

          {/* Social links */}
          <div className="mt-4 flex items-center gap-2">
            {profile.links.map((link) => {
              const Icon = linkIcon[link.platform];
              return (
                <a
                  key={link.platform}
                  href={link.href}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.04] text-white/60 transition-colors hover:border-[rgba(232,98,58,0.4)] hover:text-[#e8623a]"
                >
                  <Icon />
                </a>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:flex-col sm:items-stretch">
          <button className="rounded-full bg-[#e8623a] px-5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#f0754d]">
            JAM
          </button>
          <button className="rounded-full border border-white/[0.14] bg-white/[0.04] px-5 py-2 text-[13px] font-semibold text-white transition-colors hover:border-white/[0.3] hover:bg-white/[0.08]">
            Message
          </button>
        </div>
      </div>

      {/* Looking-for pinned card */}
      {profile.lookingFor && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[rgba(232,98,58,0.22)] bg-[rgba(232,98,58,0.05)] p-4">
          <PinIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e8623a]" />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#e8623a]">
              Looking for
            </div>
            <div className="mt-0.5 text-sm text-white/80">{profile.lookingFor}</div>
          </div>
        </div>
      )}

      {/* Two-column: portfolio (main) + stats rail */}
      <div className="mt-10 grid gap-8 sm:mt-12 lg:grid-cols-[1fr_260px]">
        <div className="min-w-0 space-y-10">
          {/* Clips / portfolio */}
          <div>
            <div className="mb-4 flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
              <span>Clips</span>
              <span className="h-px flex-1 bg-white/[0.06]" />
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3">
              {clips.map((clip) => (
                <button
                  key={clip.id}
                  className="group relative flex aspect-[4/5] w-40 flex-shrink-0 flex-col justify-end overflow-hidden rounded-xl border border-white/[0.06] p-3 text-left sm:aspect-video sm:w-auto"
                  style={{ background: clip.artGradient }}
                >
                  <span className="absolute right-2 top-2 text-2xl opacity-70">
                    {clip.emoji}
                  </span>
                  <span className="absolute right-2 bottom-2 rounded bg-black/50 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                    {clip.duration}
                  </span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-transform group-hover:scale-110">
                      <PlayIcon className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="relative z-[1] truncate font-display text-[13px] italic text-white">
                    {clip.title}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Scans (secondary) */}
          <ScanGrid scans={scans} />
        </div>

        {/* Stats rail */}
        <aside className="order-first flex flex-row items-center gap-8 lg:order-none lg:flex-col lg:items-start lg:gap-6">
          <Stat value={profile.scanCount} label="Scans" />
          <Stat value={profile.connectionCount} label="Connections" />
        </aside>
      </div>
    </div>
  );
}
