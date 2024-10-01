import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import { geolocation } from '@vercel/functions';


//to get nearby users using postgos
// export async function GET(req: Request) {
//     try {
//         const { user: loggedInUser } = await validateRequest();
//         console.log("h")
//         if (!loggedInUser) {
//           return Response.json({ error: "Unauthorized" }, { status: 401 });
//         }
    
//         let userLocation = await prisma.$queryRaw<
//       {
//         id: string | null;
//         st_x: number | null;
//         st_y: number | null;
//       }[]
//     >`SELECT id, ST_X(coords::geometry) AS st_x, ST_Y(coords::geometry) AS st_y 
//       FROM "UserLocation" 
//       WHERE userId = ${loggedInUser.id}`;

//     if (userLocation.length === 0) {
//         const res = geolocation(req);

//         console.log(res)
//     }
    
//         return Response.json({ }, { status: 201 });
//       } catch (error) {
//         console.error(error);
//         return Response.json({ error: "Internal server error" }, { status: 500 });
//       }
// }


export async function GET(req: Request) {
  try {
      const { user: loggedInUser } = await validateRequest();
      console.log("h")
      if (!loggedInUser) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }

      const loggedInUserCity = await prisma.userContact.findFirst({
        where: {
          userId: loggedInUser.id
        },
        select: {
          city: true
        }
      })

      if(!loggedInUserCity){
        return Response.json({ error: "City not found" }, { status: 404 });
      }
      
      const nearbyUsers = await prisma.userContact.findMany({
        where: {
          city: loggedInUserCity.city,
          userId: {
            not: loggedInUser.id
          },
          AND: [
            {
              user: {
                receivedConnections: {
                  none: {
                    requesterId: loggedInUser.id
                  }
                }
              }
            },
            {
              user: {
                sentConnections: {
                  none: {
                    recipientId: loggedInUser.id
                  }
                }
              }
            }
          ]
        },
        select: {
          userId: true,
          city: true,
          user: {
            select: getUserDataSelect(loggedInUser.id)
          }
        }
      });
    
  
      return Response.json( nearbyUsers , { status: 201 });
    } catch (error) {
      console.error(error);
      return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}