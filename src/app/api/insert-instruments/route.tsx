import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import prisma from '@/lib/prisma';

type Instrument = {
  category: string;
  name: string;
};

export const POST = async (req: Request): Promise<Response> => {
  try {
    const filePath = path.join(process.cwd(), 'public', 'instruments.csv');
    const instruments: Instrument[] = [];

    // Read and parse the CSV file
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        instruments.push({
          category: row.category, // Adjust based on your CSV column name
          name: row.name, // Adjust based on your CSV column name
        });
      })
      .on('end', async () => {
        console.log('CSV file successfully processed');
          console.log('Instruments:', instruments);
        // Insert data into the database
        try {
          await prisma.instruments.createMany({
            data: instruments,
          });
          console.log('Instruments inserted successfully');
        } catch (error) {
          console.error('Error inserting instruments:', error);
        } finally {
          await prisma.$disconnect();
        }
      });

    return new Response('Instruments processing started', { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Error processing instruments', { status: 500 });
  }
};