import Linkify from "@/components/Linkify";
import { UserData } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface ArtistCardProps {
  artist: UserData;
}

const ArtistCard: FC<ArtistCardProps> = ({ artist }) => {
  console.log("runnign her", artist);
  return (
    <div className="flex-col flex min-h-[60%] w-full min-w-[97%] snap-y snap-center  overflow-auto scrollbar-hide rounded-lg  text-white shadow-sm shadow-muted">
      <Link href={`/users/${artist.username}`}>
        <div className="relative h-64 w-full">
          <Image
            src={artist.avatarUrl || "/placeholder.png"}
            alt={artist.username}
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <h2 className="text-2xl font-bold">{artist.displayName}</h2>
            <p className="text-base font-sans">{artist.musicalInfo?.title}</p>
          </div>
        </div>

        <div className="space-y-4 p-4">

        { artist.musicalInfo &&  artist.musicalInfo.yearsOfExperience && 
        
        Number(artist.musicalInfo.yearsOfExperience) === 0 ?
        
        <p className="mb-2 text-lg">

            <span className="italic mx-2">
            {artist.musicalInfo?.primaryInstrument.name}
            </span>
             Enthusiast
        
        </p> :
        
        <p className="mb-2 text-lg">
          <span className="font-sans mx-2">
            {artist.musicalInfo?.yearsOfExperience} 
            </span>
            {Number(artist.musicalInfo?.yearsOfExperience) > 1 ?  "Years" : "Year"} of{" "}
            <span className="italic mx-2">
            {artist.musicalInfo?.primaryInstrument.name}
            </span>
             Mastery
          </p>}

          <div>
            <div className="flex flex-wrap gap-2">
              {artist.musicalInfo?.instruments.map((instrument, index) => (
                <span
                  key={index}
                  className="rounded-full bg-muted px-3 py-2 font-sans text-sm"
                >
                  {instrument}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold">Genres</h3>
            <p className="prose prose-invert text-base">
              {artist.musicalInfo?.genres.join(", ")}
            </p>
          </div>

          {artist.musicalInfo &&  artist.musicalInfo.bio && (
            <div className="mb-4 flex flex-col gap-1 text-lg italic">
              <Linkify>
                <p className="flex flex-wrap overflow-hidden whitespace-pre-line break-words ">
                  {artist.musicalInfo.bio}
                </p>
              </Linkify>
            </div>
          )}


        </div>

      </Link>
    </div>
  );
};

export default ArtistCard;


