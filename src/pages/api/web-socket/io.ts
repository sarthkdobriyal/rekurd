import { NextApiRequest } from 'next';
import { Server as NetServer } from 'http';
import { Server as SockerServer } from 'socket.io';
import { SockerIoApiResponse } from '@/lib/types';


const initializeSocketServer = (httpServer: NetServer): SockerServer => {
  const path = '/api/web-socket/io';
  return new SockerServer(httpServer, {
    path,
    addTrailingSlash: false,
  });
};

const handler = async (req: NextApiRequest, res: SockerIoApiResponse) => {
  if (!res.socket.server.io) {
    console.log('Setting up socket.io server');
    res.socket.server.io = initializeSocketServer(
      res.socket.server as unknown as NetServer
    );
  } else {
    console.log('socket.io server already set up');
  }

  res.end();
};

export default handler;