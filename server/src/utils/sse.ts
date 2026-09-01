import { Response } from 'express';

interface Client {
  id: number;
  res: Response;
}

let clients: Client[] = [];
let clientIdCounter = 0;

export function addClient(res: Response) {
  const id = ++clientIdCounter;
  clients.push({ id, res });
  
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  // Send initial connection message
  res.write(`event: connected\ndata: ${JSON.stringify({ message: 'SSE connected', clientId: id })}\n\n`);

  res.on('close', () => {
    clients = clients.filter(c => c.id !== id);
    res.end();
  });

  return id;
}

export function emitBookingUpdate(payload: any) {
  const message = `event: booking_update\ndata: ${JSON.stringify(payload)}\n\n`;
  clients.forEach(client => {
    client.res.write(message);
  });
}

export function getClientsCount() {
  return clients.length;
}