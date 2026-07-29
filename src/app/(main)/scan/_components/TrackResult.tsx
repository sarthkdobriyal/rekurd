"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScannedTrack } from "@/lib/types";
import { Clock, ExternalLink, Music, Tag } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface TrackResultProps {
  track: ScannedTrack;
  onScanAnother: () => void;
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function TrackResult({
  track,
  onScanAnother,
}: TrackResultProps) {
  const [bioExpanded, setBioExpanded] = useState(false);

  const relatedArtists = Array.isArray(track.relatedArtists)
    ? track.relatedArtists
    : [];
  const discography = Array.isArray(track.discography)
    ? track.discography
    : [];
  const composers = Array.isArray(track.composers) ? track.composers : [];

  const badges = [
    track.genre,
    track.subgenre,
    track.bpm ? `${Math.round(track.bpm)} BPM` : null,
    track.musicalKey,
  ].filter(Boolean) as string[];

  const releaseYear = track.releaseDate?.slice(0, 4) ?? null;

  return (
    <div className="space-y-4 rounded-2xl bg-card p-5 shadow-sm">
      {/* ── Header: art + title ── */}
      <div className="flex items-start gap-4">
        {track.albumArtUrl ? (
          <Image
            src={track.albumArtUrl}
            alt={track.title}
            width={88}
            height={88}
            className="aspect-square flex-none rounded-xl bg-secondary object-cover"
          />
        ) : (
          <div className="flex size-[88px] flex-none items-center justify-center rounded-xl bg-secondary">
            <Music className="size-8 text-muted-foreground" />
          </div>
        )}
        <div className="min-w-0 flex-1 pt-1">
          <p className="truncate text-xl font-bold">{track.title}</p>
          <p className="truncate text-muted-foreground">{track.artist}</p>
          {track.album && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground opacity-70">
              {track.album}
            </p>
          )}
        </div>
      </div>

      {/* ── Quick-info row ── */}
      {(releaseYear ?? track.durationMs ?? track.label) && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {releaseYear && <span>{releaseYear}</span>}
          {track.durationMs && (
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {formatDuration(track.durationMs)}
            </span>
          )}
          {track.label && (
            <span className="flex items-center gap-1 truncate">
              <Tag className="size-3 shrink-0" />
              <span className="truncate">{track.label}</span>
            </span>
          )}
        </div>
      )}

      {/* ── Genre / BPM badges ── */}
      {badges.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {badges.map((badge) => (
            <Badge key={badge} variant="secondary">
              {badge}
            </Badge>
          ))}
        </div>
      )}

      {/* ── Stream links ── */}
      {(track.spotifyTrackId ?? track.youtubeVideoId) && (
        <div className="flex flex-wrap gap-2">
          {track.spotifyTrackId && (
            <a
              href={`https://open.spotify.com/track/${track.spotifyTrackId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#1DB954]/15 px-3 py-1 text-xs font-medium text-[#1DB954] transition hover:bg-[#1DB954]/25"
            >
              <ExternalLink className="size-3" /> Spotify
            </a>
          )}
          {track.youtubeVideoId && (
            <a
              href={`https://www.youtube.com/watch?v=${track.youtubeVideoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-3 py-1 text-xs font-medium text-red-400 transition hover:bg-red-500/25"
            >
              <ExternalLink className="size-3" /> YouTube
            </a>
          )}
        </div>
      )}

      {/* ── Composers ── */}
      {composers.length > 0 && (
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Composers
          </p>
          <p className="text-sm text-muted-foreground">
            {composers.join(", ")}
          </p>
        </div>
      )}

      {/* ── Artist bio ── */}
      {track.artistBio && (
        <div>
          <p
            className={
              bioExpanded
                ? "text-sm text-muted-foreground"
                : "line-clamp-3 text-sm text-muted-foreground"
            }
          >
            {track.artistBio}
          </p>
          <button
            onClick={() => setBioExpanded((prev) => !prev)}
            className="mt-1 text-sm font-medium text-primary hover:underline"
          >
            {bioExpanded ? "Show less" : "Read more"}
          </button>
        </div>
      )}

      {/* ── Related artists ── */}
      {relatedArtists.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Similar artists
          </p>
          <div className="flex flex-wrap gap-2">
            {relatedArtists.map((artist) => (
              <Badge key={artist} variant="outline">
                {artist}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* ── Discography ── */}
      {discography.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Discography
          </p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {discography.map((release) => (
              <li key={release.title} className="flex justify-between gap-3">
                <span className="truncate">{release.title}</span>
                {release.date && (
                  <span className="flex-none">{release.date.slice(0, 4)}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Button variant="outline" className="w-full" onClick={onScanAnother}>
        Scan another song
      </Button>
    </div>
  );
}

