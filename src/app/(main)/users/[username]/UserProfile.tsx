import ConnectionCount from "@/components/ConnectionCount";
import { ConnectionInfo, UserData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import EditProfileButton from "./EditProfileButton";
import ConnectionButton from "@/components/ConnectionButton";
import Linkify from "@/components/Linkify";
import UserAvatar from "@/components/UserAvatar";
import { formatDate } from "date-fns";

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

  return (
    <div className="h-fit w-full space-y-5 rounded-2xl bg-card px-5 py-5 shadow-sm">
      <div className="flex items-center justify-between">
        <UserAvatar
          avatarUrl={user.avatarUrl}
          size={150}
          className="max-h-60 max-w-60 rounded-full"
        />

        <div className="flex w-full flex-col flex-wrap justify-center gap-3 pl-5 sm:flex-nowrap">
          <div className="space-y-2">
            <div className="flex w-full">
              <div className="flex flex-1 justify-center">
                <span className="flex flex-col items-center">
                  <span className="text-2xl font-semibold">
                    {formatNumber(user._count.posts)}
                  </span>
                  Posts
                </span>
              </div>
              <div className="flex flex-1 justify-center">
                <ConnectionCount
                  userId={user.id}
                  username={user.username}
                  initialState={connectionInfo}
                />
                {/* <FollowerCount userId={user.id} username={user.username} initialState={followerInfo} /> */}
              </div>
            </div>

            <div className="flex flex-col xl:pl-10">
              <h1 className="text-3xl font-bold">{user.displayName}</h1>
              <div className="text-muted-foreground">@{user.username}</div>
              <div>
                Member since {formatDate(user.createdAt, "MMM d, yyyy")}
              </div>
            </div>
          </div>

          {user.id === loggedInUserId ? (
            <EditProfileButton user={user} />
          ) : (
            // <FollowButton userId={user.id} initialState={followerInfo} />
            <ConnectionButton userId={user.id} initialState={connectionInfo} />
          )}
        </div>
      </div>

      {user.musicalInfo && (
        <section className="w-full">
          {/* <h2 className="mb-4 text-2xl font-bold text-secondary-foreground">
              Soundscape Story
              </h2> */}
          <p className="mb-2 text-3xl font-bold italic tracking-widest">
            {user.musicalInfo.title}
          </p>
          <p className="mb-2 text-lg italic">
            
            {user.musicalInfo.yearsOfExperience} Years of{" "}
            {user.musicalInfo.primaryInstrument.name} Mastery
          </p>
          {/* <p className="mb-2 text-lg italic">
            🎷{" "}
            <span className="text-sm font-semibold tracking-tighter text-muted-foreground">
              Primary Instrument:
            </span>{" "}
            {user.musicalInfo.primaryInstrument.name}
          </p> */}
          {user.musicalInfo.instruments && (
            <div className="mb-2 flex flex-col gap-1 text-lg italic">
              
              <span className="text-sm font-semibold tracking-tighter text-muted-foreground">
              Also Plays 
              </span>
              <span className="">
              {user.musicalInfo.instruments.join(", ")}
              </span>
            </div>
          )}
          {
            user.musicalInfo.genres
             && <div className="mb-2 flex flex-col gap-1 text-lg italic">
            <span className="text-sm font-semibold tracking-tighter text-muted-foreground">
            🎼{" "}
              Genres:
            </span>{" "}
            <span>
            {user.musicalInfo.genres.join(", ")}
            </span>
          </div>}
           { user.musicalInfo.bio && <div className="mb-4 flex flex-col gap-1 text-lg italic">
            <span className="text-sm font-semibold tracking-tighter text-muted-foreground">
            🎤{" "}
              Musical Journey:
            </span>
            <Linkify>
              <p className="flex flex-wrap overflow-hidden whitespace-pre-line break-words px-4">
                {user.musicalInfo.bio}
              </p>
            </Linkify>
          </div>}
          {user.musicalInfo.interestedInLearning && (
            <p className="mb-2 text-lg italic text-green-600">
              📚 Available to jam and learn from fellow musicians
            </p>
          )}
          {user.musicalInfo.interestedInTutoring ? (
            <p className="mb-2 text-lg italic text-blue-600">
              📢 Available to share the groove with others
            </p>
          ) : (
            <></>
          )}
        </section>
      )}

      {user.bio && (
        <>
          <hr />
          <Linkify>
            <div className="overflow-hidden whitespace-pre-line break-words">
              {user.bio}
            </div>
          </Linkify>
        </>
      )}
    </div>
  );
}


