interface LastFmEnrichment {
  bio: string | null;
  relatedArtists: string[];
}

const EMPTY_RESULT: LastFmEnrichment = {
  bio: null,
  relatedArtists: [],
};

// Last.fm bios contain HTML (links, a "read more on Last.fm" footer) — strip
// to plain text since we never render raw third-party HTML.
function stripHtml(input: string): string {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

export async function enrichFromLastFm(
  artist: string,
): Promise<LastFmEnrichment> {
  const apiKey = process.env.LASTFM_API_KEY;

  if (!apiKey) {
    console.warn("LASTFM_API_KEY is not set — skipping Last.fm enrichment.");
    return EMPTY_RESULT;
  }

  try {
    const url = new URL("https://ws.audioscrobbler.com/2.0/");
    url.searchParams.set("method", "artist.getinfo");
    url.searchParams.set("artist", artist);
    url.searchParams.set("api_key", apiKey);
    url.searchParams.set("format", "json");
    url.searchParams.set("autocorrect", "1");

    const res = await fetch(url, { signal: AbortSignal.timeout(8_000) });

    if (!res.ok) {
      throw new Error(`Last.fm request failed: ${res.status}`);
    }

    const data = await res.json();

    if (data?.error) {
      // e.g. artist not found — not a hard error, just no enrichment available.
      return EMPTY_RESULT;
    }

    const rawBio: string | undefined = data?.artist?.bio?.summary;
    const bio = rawBio ? stripHtml(rawBio) : null;

    const similar: { name: string }[] = data?.artist?.similar?.artist ?? [];
    const relatedArtists = similar.slice(0, 5).map((a) => a.name);

    return { bio: bio || null, relatedArtists };
  } catch (error) {
    console.error("Last.fm enrichment failed:", error);
    return EMPTY_RESULT;
  }
}
