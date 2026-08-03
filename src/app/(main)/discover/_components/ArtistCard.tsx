import ConnectionButton from "@/components/ConnectionButton";
import { ConnectionInfo, UserData } from "@/lib/types";
import Link from "next/link";
import { FC } from "react";

function deriveConnectionInfo(user: UserData, loggedInUserId: string): ConnectionInfo {
  const totalConnections =
    user.sentConnections.filter((c) => c.status === "CONNECTED").length +
    user.receivedConnections.filter((c) => c.status === "CONNECTED").length;

  return {
    connections: totalConnections,
    isUserConnected:
      user.sentConnections.some(
        (c) => c.status === "CONNECTED" && c.recipientId === loggedInUserId,
      ) ||
      user.receivedConnections.some(
        (c) => c.status === "CONNECTED" && c.requesterId === loggedInUserId,
      ),
    isConnectionPending:
      user.sentConnections.some(
        ({ status, recipientId }) =>
          status === "PENDING" && recipientId === loggedInUserId,
      ) ||
      user.receivedConnections.some(
        ({ status, requesterId }) =>
          status === "PENDING" && requesterId === loggedInUserId,
      ),
    isLoggedInUserSender: user.receivedConnections.some(
      ({ requesterId, status }) =>
        status === "PENDING" && requesterId === loggedInUserId,
    ),
    isLoggedInUserReciepient: user.sentConnections.some(
      ({ recipientId, status }) =>
        status === "PENDING" && recipientId === loggedInUserId,
    ),
  };
}

interface ArtistCardProps {
  artist: UserData;
  loggedInUserId: string;
}

const ArtistCard: FC<ArtistCardProps> = ({ artist, loggedInUserId }) => {
  const { musicalInfo } = artist;
  const tags = [
    musicalInfo?.primaryInstrument?.name,
    ...(musicalInfo?.genres ?? []),
  ].filter((t): t is string => !!t);

  const years = Number(musicalInfo?.yearsOfExperience ?? 0);
  const subtitle =
    musicalInfo?.title ||
    (years > 0
      ? `${years} ${years > 1 ? "years" : "year"} of ${musicalInfo?.primaryInstrument?.name ?? "music"}`
      : musicalInfo?.primaryInstrument?.name
        ? `${musicalInfo.primaryInstrument.name} enthusiast`
        : "Musician");

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0f0f0f] transition-colors hover:border-white/[0.14]">
      <Link href={`/users/${artist.username}`} className="group block">
        <div
          className="relative h-44 w-full bg-cover bg-center"
          style={{
            backgroundImage: artist.avatarUrl
              ? `url(${artist.avatarUrl})`
              : "linear-gradient(135deg,#3d180a,#1a0a08)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="truncate font-display text-[22px] italic leading-[1.15] text-white">
              {artist.displayName}
            </div>
            <div className="truncate text-[12.5px] font-medium text-[#e8623a]">
              {subtitle}
            </div>
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3.5 p-4">
        {!!tags.length && (
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/[0.07] bg-white/[0.04] px-2.5 py-0.5 text-[10.5px] font-medium text-white/52"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {musicalInfo?.bio && (
          <p className="line-clamp-2 text-[12.5px] leading-relaxed text-white/52">
            {musicalInfo.bio}
          </p>
        )}

        <div className="mt-auto pt-1">
          <ConnectionButton
            userId={artist.id}
            initialState={deriveConnectionInfo(artist, loggedInUserId)}
          />
        </div>
      </div>
    </div>
  );
};

export default ArtistCard;
