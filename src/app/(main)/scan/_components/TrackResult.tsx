"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScannedTrack } from "@/lib/types";
import { Music } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface TrackResultProps {
  track: ScannedTrack;
  onScanAnother: () => void;
}

export default function TrackResult({
  track,
  onScanAnother,
}: TrackResultProps) {
  const [bioExpanded, setBioExpanded] = useState(false);

  const badges = [
    track.genre,
    track.subgenre,
    track.bpm ? `${Math.round(track.bpm)} BPM` : null,
    track.musicalKey,
  ].filter(Boolean) as string[];

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex items-center gap-4">
        {track.albumArtUrl ? (
          <Image
            src={track.albumArtUrl}
            alt={track.title}
            width={80}
            height={80}
            className="aspect-square flex-none rounded-lg bg-secondary object-cover"
          />
        ) : (
          <div className="flex size-20 flex-none items-center justify-center rounded-lg bg-secondary">
            <Music className="size-8 text-muted-foreground" />
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-xl font-bold">{track.title}</p>
          <p className="truncate text-muted-foreground">{track.artist}</p>
        </div>
      </div>

      {badges.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {badges.map((badge) => (
            <Badge key={badge} variant="secondary">
              {badge}
            </Badge>
          ))}
        </div>
      )}

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

      {track.relatedArtists.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-semibold">Related artists</p>
          <div className="flex flex-wrap gap-2">
            {track.relatedArtists.map((artist) => (
              <Badge key={artist} variant="outline">
                {artist}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {track.discography.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-semibold">Discography</p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {track.discography.map((release) => (
              <li key={release.title} className="flex justify-between gap-3">
                <span className="truncate">{release.title}</span>
                {release.date && (
                  <span className="flex-none">
                    {release.date.slice(0, 4)}
                  </span>
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
