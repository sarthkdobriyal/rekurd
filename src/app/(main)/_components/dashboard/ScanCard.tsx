"use client";

import { useState } from "react";
import {
  BookmarkIcon,
  CommentIcon,
  HeartIcon,
  MoreDotsIcon,
  PlayIcon,
  ShareIcon,
  SpotifyIcon,
  YouTubeIcon,
} from "./icons";
import { ScanCardData } from "./mock-data";

export default function ScanCard({ scan }: { scan: ScanCardData }) {
  const [liked, setLiked] = useState(!!scan.liked);
  const [likes, setLikes] = useState(scan.likes);

  return (
    <div className="mb-3.5 rounded-2xl border border-white/[0.07] bg-[#0f0f0f] p-4 transition-colors hover:border-white/[0.14]">
      <div className="mb-3.5 flex items-center gap-2.5">
        <div
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-white/[0.08] text-[11px] font-bold"
          style={{ background: scan.user.avatarGradient, color: scan.user.avatarColor }}
        >
          {scan.user.initials}
        </div>
        <div className="min-w-0 flex-1 text-[12.5px] text-white/52">
          <strong className="font-semibold text-white">{scan.user.name}</strong>
          <span className="mx-1 text-white/26">scanned</span>
          <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-white/26">
            <span>{scan.location}</span>
            <span className="h-0.5 w-0.5 rounded-full bg-current" />
            <span>{scan.timeAgo}</span>
          </div>
        </div>
        <button className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-white/26 transition-colors hover:bg-white/[0.04] hover:text-white">
          <MoreDotsIcon />
        </button>
      </div>

      <div className="mb-3.5 flex gap-3.5">
        <div
          className="relative flex h-[88px] w-[88px] flex-shrink-0 items-center justify-center rounded-xl border border-white/[0.08] text-[34px] shadow-[0_6px_24px_rgba(0,0,0,0.4)]"
          style={{ background: scan.track.artGradient }}
        >
          {scan.track.emoji}
          <span className="absolute bottom-1.5 right-1.5 flex h-[22px] w-[22px] items-center justify-center rounded-full border border-white/20 bg-black/70 backdrop-blur">
            <PlayIcon className="h-2 w-2 text-white" />
          </span>
        </div>
        <div className="min-w-0 flex-1 pt-1">
          <div className="mb-0.5 font-display text-[22px] italic leading-[1.15] text-white">
            {scan.track.title}
          </div>
          <div className="mb-2 text-[13px] font-medium text-white/52">
            {scan.track.artist}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {scan.track.tags.map((tag) => (
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

      <div className="mb-3 flex gap-2">
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#1db954] py-2.5 text-xs font-semibold tracking-tight text-black transition-[filter] hover:brightness-110 active:scale-[0.98]"
        >
          <SpotifyIcon />
          Spotify
        </a>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.06] py-2.5 text-xs font-semibold tracking-tight text-white transition-[filter] hover:brightness-110 active:scale-[0.98]"
        >
          <YouTubeIcon className="text-[#ff0033]" />
          YouTube
        </a>
      </div>

      <div className="flex items-center gap-1.5">
        <button className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full bg-[#e8623a] text-white transition-[filter] hover:brightness-110">
          <PlayIcon />
        </button>
        <button className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full border border-[rgba(30,215,96,0.25)] bg-[rgba(30,215,96,0.1)] text-[#1ed760] transition-colors hover:bg-[rgba(30,215,96,0.16)]">
          <SpotifyIcon />
        </button>
        <button className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full border border-white/[0.07] bg-white/[0.04] text-white/52 transition-colors hover:border-white/[0.14] hover:bg-white/[0.08] hover:text-white">
          <BookmarkIcon />
        </button>
        <button className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full border border-white/[0.07] bg-white/[0.04] text-white/52 transition-colors hover:border-white/[0.14] hover:bg-white/[0.08] hover:text-white">
          <ShareIcon />
        </button>
        <div className="ml-auto flex items-center gap-3.5 text-[11.5px] text-white/26">
          <button
            onClick={() => {
              setLiked((v) => !v);
              setLikes((n) => (liked ? n - 1 : n + 1));
            }}
            className={`flex items-center gap-1 transition-colors hover:text-white/52 ${liked ? "text-[#e8623a]" : ""}`}
          >
            <HeartIcon filled={liked} /> {likes}
          </button>
          {scan.comments > 0 && (
            <span className="flex items-center gap-1">
              <CommentIcon /> {scan.comments}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
