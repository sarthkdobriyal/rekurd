interface MusicBrainzEnrichment {
  genre: string | null;
  subgenre: string | null;
  artistMbid: string | null;
  discography: { title: string; date: string | null }[];
}

const EMPTY_RESULT: MusicBrainzEnrichment = {
  genre: null,
  subgenre: null,
  artistMbid: null,
  discography: [],
};

function getUserAgent() {
  const ua = process.env.MUSICBRAINZ_USER_AGENT;
  if (!ua) {
    console.warn(
      "MUSICBRAINZ_USER_AGENT is not set — MusicBrainz's usage policy requires a descriptive User-Agent identifying your app and contact info, or requests may be throttled/blocked.",
    );
  }
  return ua ?? "Outsound/0.1 (no-contact-configured)";
}

async function mbFetch(path: string) {
  const res = await fetch(`https://musicbrainz.org/ws/2/${path}`, {
    headers: {
      "User-Agent": getUserAgent(),
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(8_000),
  });

  if (!res.ok) {
    throw new Error(`MusicBrainz request failed: ${res.status}`);
  }

  return res.json();
}

function topTags(entity: any): string[] {
  const tags: { name: string; count?: number }[] =
    entity?.genres?.length ? entity.genres : entity?.tags ?? [];

  return tags
    .slice()
    .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
    .map((t) => t.name);
}

async function findRecording(isrc: string | null, title: string, artist: string) {
  if (isrc) {
    const data = await mbFetch(
      `isrc/${encodeURIComponent(isrc)}?inc=tags+genres+artist-credits&fmt=json`,
    );
    if (data?.recordings?.length) {
      return data.recordings[0];
    }
  }

  const query = `recording:"${title}" AND artist:"${artist}"`;
  const data = await mbFetch(
    `recording/?query=${encodeURIComponent(query)}&inc=tags+genres+artist-credits&fmt=json&limit=1`,
  );

  return data?.recordings?.[0] ?? null;
}

async function findDiscography(artistMbid: string) {
  try {
    const data = await mbFetch(
      `release-group?artist=${artistMbid}&type=album&fmt=json&limit=5`,
    );
    const groups: any[] = data?.["release-groups"] ?? [];
    return groups.map((g) => ({
      title: g.title as string,
      date: (g["first-release-date"] as string) || null,
    }));
  } catch (error) {
    console.error("MusicBrainz release-group lookup failed:", error);
    return [];
  }
}

export async function enrichFromMusicBrainz(params: {
  isrc: string | null;
  title: string;
  artist: string;
}): Promise<MusicBrainzEnrichment> {
  try {
    const recording = await findRecording(params.isrc, params.title, params.artist);

    if (!recording) {
      return EMPTY_RESULT;
    }

    const tags = topTags(recording);
    const artistMbid: string | null =
      recording["artist-credit"]?.[0]?.artist?.id ?? null;

    const discography = artistMbid ? await findDiscography(artistMbid) : [];

    return {
      genre: tags[0] ?? null,
      subgenre: tags[1] ?? null,
      artistMbid,
      discography,
    };
  } catch (error) {
    console.error("MusicBrainz enrichment failed:", error);
    return EMPTY_RESULT;
  }
}
