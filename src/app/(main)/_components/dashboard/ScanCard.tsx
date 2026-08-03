"use client";

import Link from "next/link";
import {
  MoreDotsIcon,
  PlayIcon,
  ShareIcon,
  SpotifyIcon,
  YouTubeIcon,
} from "./icons";
import { ScanView } from "./mock-data";

// Deterministic fallback avatar tint when a user has no avatarUrl.
const AVATAR_TINTS = [
  { bg: "linear-gradient(135deg,#3d180a,#1a0a08)", fg: "#e8623a" },
  { bg: "linear-gradient(135deg,#08102a,#050813)", fg: "#7c9ee8" },
  { bg: "linear-gradient(135deg,#0a180a,#050d05)", fg: "#4ec26e" },
  { bg: "linear-gradient(135deg,#2a0820,#140410)", fg: "#e05aa8" },
];

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function tint(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return AVATAR_TINTS[Math.abs(h) % AVATAR_TINTS.length];
}

export default function ScanCard({ scan }: { scan: ScanView }) {
  const { user, track } = scan;

  const onShare = async () => {
    const data = {
      title: `${track.title} — ${track.artist}`,
      text: `${user.name} scanned ${track.title} by ${track.artist} on rekurd`,
      url: scan.spotifyUrl,
    };
    try {
      if (navigator.share) await navigator.share(data);
      else await navigator.clipboard.writeText(data.url);
    } catch {
      /* user dismissed the share sheet — nothing to do */
    }
  };

  const avatarTint = tint(user.username ?? user.name);

  return (
    <div className="mb-3.5 rounded-2xl border border-white/[0.07] bg-[#0f0f0f] p-4 transition-colors hover:border-white/[0.14]">
      <div className="mb-3.5 flex items-center gap-2.5">
        {user.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="h-8 w-8 flex-shrink-0 rounded-full border border-white/[0.08] object-cover"
          />
        ) : (
          <div
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-white/[0.08] text-[11px] font-bold"
            style={{ background: avatarTint.bg, color: avatarTint.fg }}
          >
            {initials(user.name)}
          </div>
        )}
        <div className="min-w-0 flex-1 text-[12.5px] text-white/52">
          {user.username ? (
            <Link
              href={`/users/${user.username}`}
              className="font-semibold text-white hover:underline"
            >
              {user.name}
            </Link>
          ) : (
            <strong className="font-semibold text-white">{user.name}</strong>
          )}
          <span className="mx-1 text-white/26">scanned</span>
          <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-white/26">
            {scan.location && (
              <>
                <span>{scan.location}</span>
                <span className="h-0.5 w-0.5 rounded-full bg-current" />
              </>
            )}
            <span>{scan.timeAgo}</span>
          </div>
        </div>
        <button
          aria-label="More"
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-white/26 transition-colors hover:bg-white/[0.04] hover:text-white"
        >
          <MoreDotsIcon />
        </button>
      </div>

      <div className="mb-3.5 flex gap-3.5">
        <a
          href={scan.spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex h-[88px] w-[88px] flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/[0.08] text-[34px] shadow-[0_6px_24px_rgba(0,0,0,0.4)]"
          style={track.artUrl ? undefined : { background: track.artGradient ?? "linear-gradient(135deg,#181818,#0a0a0a)" }}
        >
          {track.artUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={track.artUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <span>{track.emoji ?? "🎵"}</span>
          )}
          <span className="absolute bottom-1.5 right-1.5 flex h-[22px] w-[22px] items-center justify-center rounded-full border border-white/20 bg-black/70 backdrop-blur transition-transform group-hover:scale-110">
            <PlayIcon className="h-2 w-2 text-white" />
          </span>
        </a>
        <div className="min-w-0 flex-1 pt-1">
          <div className="mb-0.5 truncate font-display text-[22px] italic leading-[1.15] text-white">
            {track.title}
          </div>
          <div className="mb-2 truncate text-[13px] font-medium text-white/52">
            {track.artist}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {track.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/[0.07] bg-white/[0.04] px-2.5 py-0.5 text-[10.5px] font-medium text-white/52"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <a
          href={scan.spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#1db954] py-2.5 text-xs font-semibold tracking-tight text-black transition-[filter] hover:brightness-110 active:scale-[0.98]"
        >
          <SpotifyIcon />
          Spotify
        </a>
        <a
          href={scan.youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.06] py-2.5 text-xs font-semibold tracking-tight text-white transition-[filter] hover:brightness-110 active:scale-[0.98]"
        >
          <YouTubeIcon className="text-[#ff0033]" />
          YouTube
        </a>
        <button
          onClick={onShare}
          aria-label="Share"
          className="flex w-11 flex-shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.04] text-white/52 transition-colors hover:border-white/[0.14] hover:bg-white/[0.08] hover:text-white"
        >
          <ShareIcon />
        </button>
      </div>
    </div>
  );
}
