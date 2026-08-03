import ConnectionCount from "@/components/ConnectionCount";
import { ConnectionInfo, UserData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import EditProfileButton from "./EditProfileButton";
import Linkify from "@/components/Linkify";
import UserAvatar from "@/components/UserAvatar";
import { formatDate } from "date-fns";
import ProfileConnectionActions from "./ProfileConnectionActions";

interface UserProfileProps {
  user: UserData;
  loggedInUserId: string;
}

export default function UserProfile({
  user,
  loggedInUserId,
}: UserProfileProps) {
  const totalConnections =
    user.sentConnections.filter((conn) => conn.status === "CONNECTED").length +
    user.receivedConnections.filter((conn) => conn.status === "CONNECTED")
      .length;

  const connectionInfo: ConnectionInfo = {
    connections: totalConnections,
    isUserConnected:
      user.sentConnections.some(
        (conn) =>
          conn.status === "CONNECTED" && conn.recipientId === loggedInUserId,
      ) ||
      user.receivedConnections.some(
        (conn) =>
          conn.status === "CONNECTED" && conn.requesterId === loggedInUserId,
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

  const isSelf = user.id === loggedInUserId;
  const info = user.musicalInfo;
  const years = Number(info?.yearsOfExperience ?? 0);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0f0f0f]">
      <div className="h-24 w-full bg-[radial-gradient(circle_at_20%_20%,rgba(232,98,58,0.22),transparent_60%),linear-gradient(135deg,#180a0a,#0a0a0a)]" />

      <div className="px-5 pb-5 sm:px-6">
        <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <UserAvatar
              avatarUrl={user.avatarUrl}
              size={96}
              className="h-24 w-24 rounded-full border-4 border-[#0f0f0f] bg-[#0f0f0f]"
            />
            <div className="pb-1">
              <h1 className="font-display text-[26px] italic leading-tight text-white">
                {user.displayName}
              </h1>
              <div className="text-[13px] text-white/40">@{user.username}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {isSelf ? (
              <EditProfileButton user={user} />
            ) : (
              <ProfileConnectionActions
                userId={user.id}
                initialState={connectionInfo}
              />
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-6 text-[13px]">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-white">
              {formatNumber(user._count.posts)}
            </span>
            <span className="text-white/40">Posts</span>
          </div>
          <ConnectionCount
            userId={user.id}
            username={user.username}
            initialState={connectionInfo}
          />
          <span className="text-white/26">
            Since {formatDate(user.createdAt, "MMM yyyy")}
          </span>
        </div>

        {info?.title && (
          <p className="mt-4 font-display text-[18px] italic text-[#e8623a]">
            {info.title}
          </p>
        )}

        {info && (years > 0 || info.primaryInstrument?.name) && (
          <p className="mt-1 text-[13px] text-white/52">
            {years > 0
              ? `${years} ${years > 1 ? "years" : "year"} of ${info.primaryInstrument?.name ?? "music"}`
              : `${info.primaryInstrument?.name} enthusiast`}
          </p>
        )}

        {(!!info?.instruments?.length || !!info?.genres?.length) && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {[
              ...(info?.instruments ?? []),
              ...(info?.genres ?? []),
            ].map((tag, i) => (
              <span
                key={`${tag}-${i}`}
                className="rounded-full border border-white/[0.07] bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-medium text-white/52"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {info?.bio && (
          <div className="mt-4">
            <div className="mb-1 text-[10.5px] font-bold uppercase tracking-[0.14em] text-white/40">
              Musical journey
            </div>
            <Linkify>
              <p className="whitespace-pre-line break-words text-[13px] leading-relaxed text-white/70">
                {info.bio}
              </p>
            </Linkify>
          </div>
        )}

        {(info?.interestedInLearning || info?.interestedInTutoring) && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {info.interestedInLearning && (
              <span className="rounded-full border border-[#4ec26e]/30 bg-[#4ec26e]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#4ec26e]">
                Open to jam &amp; learn
              </span>
            )}
            {info.interestedInTutoring && (
              <span className="rounded-full border border-[#7c9ee8]/30 bg-[#7c9ee8]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#7c9ee8]">
                Open to tutor
              </span>
            )}
          </div>
        )}

        {user.bio && (
          <>
            <hr className="my-4 border-white/[0.07]" />
            <Linkify>
              <div className="whitespace-pre-line break-words text-[13px] leading-relaxed text-white/70">
                {user.bio}
              </div>
            </Linkify>
          </>
        )}
      </div>
    </div>
  );
}
