// Real endpoints now wired:
// - GET /api/scans/friends   → friends feed (scans by your JAM connections)
// - GET /api/scans/dashboard → right-rail "recently scanned" + "trending"
// Still mock: nearby feed + nearby rail — scans don't capture location yet.

export function spotifySearchUrl(artist: string, title: string) {
  const q = encodeURIComponent(`${artist} ${title}`);
  return `https://open.spotify.com/search/${q}`;
}

export function youtubeSearchUrl(artist: string, title: string) {
  const q = encodeURIComponent(`${artist} ${title}`);
  return `https://music.youtube.com/search?q=${q}`;
}

// View-model the ScanCard renders — fed by the friends API (real) and the
// nearby mock below. Presentation fallbacks (initials, gradient) are derived
// in the card, not stored here.
export interface ScanView {
  id: string;
  user: { name: string; username?: string; avatarUrl?: string };
  timeAgo: string;
  location?: string;
  track: {
    title: string;
    artist: string;
    tags: string[];
    artUrl?: string;
    artGradient?: string;
    emoji?: string;
  };
  spotifyUrl: string;
  youtubeUrl: string;
}

export interface ScanFeedPage {
  scans: ScanView[];
  nextCursor: string | null;
}

// ponytail: nearby feed still mock — scans have no location, add when captured.
export const nearbyFeed: ScanView[] = [
  {
    id: "n1",
    user: { name: "Felipe Torres" },
    location: "Union Pool · 0.2km",
    timeAgo: "18m ago",
    track: {
      title: "Blinding Lights",
      artist: "The Weeknd",
      tags: ["Synth-pop", "2019"],
      artGradient: "linear-gradient(135deg,#180a0a,#3d0808)",
      emoji: "🎵",
    },
    spotifyUrl: spotifySearchUrl("The Weeknd", "Blinding Lights"),
    youtubeUrl: youtubeSearchUrl("The Weeknd", "Blinding Lights"),
  },
  {
    id: "n2",
    user: { name: "Priya R." },
    location: "Baby's All Right · 0.4km",
    timeAgo: "32m ago",
    track: {
      title: "Murder on the Dancefloor",
      artist: "Sophie Ellis-Bextor",
      tags: ["Nu-disco", "Dance"],
      artGradient: "linear-gradient(135deg,#0a0a18,#0a0a3d)",
      emoji: "💃",
    },
    spotifyUrl: spotifySearchUrl("Sophie Ellis-Bextor", "Murder on the Dancefloor"),
    youtubeUrl: youtubeSearchUrl("Sophie Ellis-Bextor", "Murder on the Dancefloor"),
  },
];

export interface RailItemData {
  id: string;
  title: string;
  subtitle: string;
  artGradient: string;
  emoji: string;
  artUrl?: string;
  rank?: number;
  trend?: string;
}

export const recentlyScanned: RailItemData[] = [
  { id: "r1", title: "Ultralight Beam", subtitle: "Kanye West · Yesterday", artGradient: "linear-gradient(135deg,#180a18,#3d0a3d)", emoji: "🎧" },
  { id: "r2", title: "So What", subtitle: "Miles Davis · 2 days ago", artGradient: "linear-gradient(135deg,#0a1818,#0a3d3d)", emoji: "🎺" },
  { id: "r3", title: "Bohemian Rhapsody", subtitle: "Queen · 3 days ago", artGradient: "linear-gradient(135deg,#1a1808,#3d3a0a)", emoji: "🎻" },
  { id: "r4", title: "Murder on the Dancefloor", subtitle: "Sophie Ellis-Bextor · 4d", artGradient: "linear-gradient(135deg,#0a0a18,#0a0a3d)", emoji: "💪" },
];

export const trendingScans: RailItemData[] = [
  { id: "t1", rank: 1, title: "Blinding Lights", subtitle: "The Weeknd", artGradient: "linear-gradient(135deg,#180a0a,#3d0808)", emoji: "🎵", trend: "12k" },
  { id: "t2", rank: 2, title: "Something in the Way", subtitle: "Nirvana", artGradient: "linear-gradient(135deg,#1a0a08,#3d180a)", emoji: "🎸", trend: "8.4k" },
  { id: "t3", rank: 3, title: "Clair de Lune", subtitle: "Claude Debussy", artGradient: "linear-gradient(135deg,#080a1a,#0a183d)", emoji: "🎹", trend: "6.1k" },
  { id: "t4", rank: 4, title: "Take Five", subtitle: "Dave Brubeck Quartet", artGradient: "linear-gradient(135deg,#0a180a,#183d0a)", emoji: "🎥", trend: "3.9k" },
  { id: "t5", rank: 5, title: "Ultralight Beam", subtitle: "Kanye West", artGradient: "linear-gradient(135deg,#180a18,#3d0a3d)", emoji: "🎧", trend: "2.7k" },
];

export const nearbyTonight: RailItemData[] = [
  { id: "v1", title: "Union Pool", subtitle: "6 scans · 0.2km", artGradient: "linear-gradient(135deg,#180a0a,#3d0808)", emoji: "🎵" },
  { id: "v2", title: "Baby's All Right", subtitle: "4 scans · 0.4km", artGradient: "linear-gradient(135deg,#0a0a18,#0a0a3d)", emoji: "💪" },
  { id: "v3", title: "Elsewhere Rooftop", subtitle: "2 scans · 0.9km", artGradient: "linear-gradient(135deg,#0a180a,#183d0a)", emoji: "🎥" },
];

export type FilterKey = "friends" | "nearby" | "discover" | "following" | "saved";

export const filterCounts: Partial<Record<FilterKey, number>> = {
  friends: 24,
  nearby: 12,
};
