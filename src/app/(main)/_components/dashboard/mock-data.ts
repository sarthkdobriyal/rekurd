// TODO(backend): replace with real data once these endpoints exist:
// - GET /api/scans/feed?filter=friends|nearby|discover|following|saved
// - GET /api/scans/recent (recently scanned by the current user)
// - GET /api/scans/trending
// - GET /api/scans/nearby-clusters (venue-level "N people scanned this nearby tonight")
export interface ScanCardData {
  id: string;
  user: { name: string; initials: string; avatarGradient: string; avatarColor: string };
  location: string;
  timeAgo: string;
  track: {
    title: string;
    artist: string;
    tags: string[];
    duration: string;
    artGradient: string;
    emoji: string;
  };
  likes: number;
  comments: number;
  liked?: boolean;
}

export const friendsFeed: ScanCardData[] = [
  {
    id: "f1",
    user: {
      name: "Maya Kumar",
      initials: "MK",
      avatarGradient: "linear-gradient(135deg,#3d180a,#1a0a08)",
      avatarColor: "#e8623a",
    },
    location: "Brooklyn",
    timeAgo: "2h ago",
    track: {
      title: "Something in the Way",
      artist: "Nirvana · Nevermind",
      tags: ["Grunge", "1991", "3:52"],
      duration: "3:52",
      artGradient: "linear-gradient(135deg,#1a0a08,#3d180a)",
      emoji: "🎸",
    },
    likes: 47,
    comments: 8,
    liked: true,
  },
  {
    id: "f2",
    user: {
      name: "Sam Rose",
      initials: "SR",
      avatarGradient: "#08102a",
      avatarColor: "#7c9ee8",
    },
    location: "at Blue Note NYC",
    timeAgo: "5h ago",
    track: {
      title: "Clair de Lune",
      artist: "Claude Debussy · Suite bergamasque",
      tags: ["Classical", "Piano", "5:07"],
      duration: "5:07",
      artGradient: "linear-gradient(135deg,#080a1a,#0a183d)",
      emoji: "🎹",
    },
    likes: 122,
    comments: 19,
  },
  {
    id: "f3",
    user: {
      name: "Jazz Pal",
      initials: "JP",
      avatarGradient: "#0a180a",
      avatarColor: "#4ec26e",
    },
    location: "Village Vanguard",
    timeAgo: "11h ago",
    track: {
      title: "Take Five",
      artist: "Dave Brubeck Quartet · Time Out",
      tags: ["Jazz", "Cool Jazz", "5:24"],
      duration: "5:24",
      artGradient: "linear-gradient(135deg,#0a180a,#183d0a)",
      emoji: "🎥",
    },
    likes: 68,
    comments: 12,
  },
];

export const nearbyFeed: ScanCardData[] = [
  {
    id: "n1",
    user: {
      name: "Felipe Torres",
      initials: "FT",
      avatarGradient: "#180a0a",
      avatarColor: "#e84e4e",
    },
    location: "Union Pool · 0.2km",
    timeAgo: "18m ago",
    track: {
      title: "Blinding Lights",
      artist: "The Weeknd · After Hours",
      tags: ["Synth-pop", "2019", "3:20"],
      duration: "3:20",
      artGradient: "linear-gradient(135deg,#180a0a,#3d0808)",
      emoji: "🎵",
    },
    likes: 89,
    comments: 0,
    liked: true,
  },
  {
    id: "n2",
    user: {
      name: "Priya R.",
      initials: "PR",
      avatarGradient: "#0a0a18",
      avatarColor: "#6e8ee8",
    },
    location: "Baby's All Right · 0.4km",
    timeAgo: "32m ago",
    track: {
      title: "Murder on the Dancefloor",
      artist: "Sophie Ellis-Bextor · Read My Lips",
      tags: ["Nu-disco", "Dance", "3:47"],
      duration: "3:47",
      artGradient: "linear-gradient(135deg,#0a0a18,#0a0a3d)",
      emoji: "💪",
    },
    likes: 41,
    comments: 0,
  },
];

export interface RailItemData {
  id: string;
  title: string;
  subtitle: string;
  artGradient: string;
  emoji: string;
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
