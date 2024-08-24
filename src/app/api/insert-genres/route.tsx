import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import prisma from '@/lib/prisma';

type Genre = {
  genre: string;
  subgenre: string;
};

export const POST = async (req: Request): Promise<Response> => {
  try {
    const filePath = path.join(process.cwd(), 'public', 'genres.csv');
    const Genres: Genre[] = [];

    // Read and parse the CSV file
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {

        Genres.push({
          genre: row.genre, // Adjust based on your CSV column name
          subgenre: row.subgenre, // Adjust based on your CSV column name
        });
      })
      .on('end', async () => {
        console.log('CSV file successfully processed');
          // console.log('Genres:', Genres);
        // Insert data into the database
        try {
          await prisma.genre.createMany({
            data: Genres,
          });
          console.log('Genres inserted successfully');
        } catch (error) {
          console.error('Error inserting Genres:', error);
        } finally {
          await prisma.$disconnect();
        }
      });

    return new Response('Genres processing started', { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Error processing Genres', { status: 500 });
  }
};