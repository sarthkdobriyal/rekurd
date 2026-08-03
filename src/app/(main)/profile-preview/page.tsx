import Link from "next/link";
import { PlayIcon } from "@/app/(main)/_components/dashboard/icons";

// TODO(backend): replace with real data once these endpoints exist:
// - GET /api/users/me (display name, username, avatar, counts)
// - GET /api/scans/by-user/:id (reverse-chronological scan grid)
interface ProfileData {
  displayName: string;
  username: string;
  initials: string;
  avatarGradient: string;
  avatarColor: string;
  scanCount: number;
  connectionCount: number;
}

interface ScanTile {
  id: string;
  title: string;
  artist: string;
  artGradient: string;
  emoji: string;
  timeAgo: string;
}

const profile: ProfileData = {
  displayName: "Maya Kumar",
  username: "mayakumar",
  initials: "MK",
  avatarGradient: "linear-gradient(135deg,#3d180a,#1a0a08)",
  avatarColor: "#e8623a",
  scanCount: 34,
  connectionCount: 128,
};

const scans: ScanTile[] = [
  { id: "s1", title: "Something in the Way", artist: "Nirvana", artGradient: "linear-gradient(135deg,#1a0a08,#3d180a)", emoji: "🎸", timeAgo: "2h" },
  { id: "s2", title: "Clair de Lune", artist: "Claude Debussy", artGradient: "linear-gradient(135deg,#080a1a,#0a183d)", emoji: "🎹", timeAgo: "5h" },
  { id: "s3", title: "Take Five", artist: "Dave Brubeck Quartet", artGradient: "linear-gradient(135deg,#0a180a,#183d0a)", emoji: "🎷", timeAgo: "11h" },
  { id: "s4", title: "Blinding Lights", artist: "The Weeknd", artGradient: "linear-gradient(135deg,#180a0a,#3d0808)", emoji: "🎵", timeAgo: "1d" },
  { id: "s5", title: "Ultralight Beam", artist: "Kanye West", artGradient: "linear-gradient(135deg,#180a18,#3d0a3d)", emoji: "🎧", timeAgo: "2d" },
  { id: "s6", title: "So What", artist: "Miles Davis", artGradient: "linear-gradient(135deg,#0a1818,#0a3d3d)", emoji: "🎺", timeAgo: "2d" },
  { id: "s7", title: "Bohemian Rhapsody", artist: "Queen", artGradient: "linear-gradient(135deg,#1a1808,#3d3a0a)", emoji: "🎻", timeAgo: "3d" },
  { id: "s8", title: "Murder on the Dancefloor", artist: "Sophie Ellis-Bextor", artGradient: "linear-gradient(135deg,#0a0a18,#0a0a3d)", emoji: "🪩", timeAgo: "4d" },
  { id: "s9", title: "Time Out", artist: "Dave Brubeck", artGradient: "linear-gradient(135deg,#0a180a,#183d0a)", emoji: "🎼", timeAgo: "5d" },
];

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

export default function ProfilePreviewPage() {
  return (
    <div className="mx-auto w-full max-w-[820px] px-4 pb-24 pt-6 sm:px-6 sm:pt-10">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:gap-6">
        <div
          className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full border border-white/[0.08] font-display text-3xl italic sm:h-28 sm:w-28 sm:text-4xl"
          style={{ background: profile.avatarGradient, color: profile.avatarColor }}
        >
          {profile.initials}
        </div>

        <div className="flex flex-1 flex-col items-center sm:items-start">
          <h1 className="font-display text-[30px] italic leading-tight text-white sm:text-[38px]">
            {profile.displayName}
          </h1>
          <span className="text-sm text-white/40">@{profile.username}</span>

          <div className="mt-4 flex items-center gap-8 sm:mt-5">
            <Stat value={profile.scanCount} label="Scans" />
            <span className="h-8 w-px bg-white/[0.08]" />
            <Stat value={profile.connectionCount} label="Connections" />
          </div>
        </div>

        <button className="mt-2 rounded-full border border-white/[0.14] bg-white/[0.04] px-5 py-2 text-[13px] font-semibold text-white transition-colors hover:border-white/[0.3] hover:bg-white/[0.08] sm:mt-0 sm:self-end">
          Edit profile
        </button>
      </div>

      {/* Section label */}
      <div className="mb-4 mt-10 flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40 sm:mt-12">
        <span>Scans</span>
        <span className="h-px flex-1 bg-white/[0.06]" />
      </div>

      {/* Scan grid */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
        {scans.map((scan) => (
          <Link
            key={scan.id}
            href="#"
            className="group relative flex aspect-square flex-col justify-end overflow-hidden rounded-xl border border-white/[0.06] p-2.5 transition-transform hover:-translate-y-0.5 sm:p-3.5"
            style={{ background: scan.artGradient }}
          >
            <span className="absolute right-2 top-2 text-lg opacity-70 sm:text-2xl">
              {scan.emoji}
            </span>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm">
                <PlayIcon className="h-4 w-4" />
              </span>
            </div>
            <div className="relative z-[1]">
              <div className="truncate font-display text-[13px] italic leading-tight text-white sm:text-[15px]">
                {scan.title}
              </div>
              <div className="truncate text-[10px] text-white/50 sm:text-[11px]">
                {scan.artist} · {scan.timeAgo}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
