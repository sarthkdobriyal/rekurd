import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient().$extends({
    model: {
      userLocation: {
        async upsertLocation(data: {
          userId: string;
          latitude: number;
          longitude: number;
        }) {
          const point = `POINT(${data.longitude} ${data.latitude})`;

          // Upsert the user location
          await prisma.$executeRaw`
            INSERT INTO "UserLocation" (id, "userId", coords)
            VALUES (gen_random_uuid(), ${data.userId}, ST_GeomFromText(${point}, 4326))
            ON CONFLICT ("userId") DO UPDATE
            SET coords = ST_GeomFromText(${point}, 4326);
          `;

          return {
            userId: data.userId,
            coords: {
              latitude: data.latitude,
              longitude: data.longitude,
            },
          };
        },
      },
    },
  });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;