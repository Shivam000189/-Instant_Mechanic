"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addClient = addClient;
exports.emitBookingUpdate = emitBookingUpdate;
exports.getClientsCount = getClientsCount;
let clients = [];
let clientIdCounter = 0;
function addClient(res) {
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
function emitBookingUpdate(payload) {
    const message = `event: booking_update\ndata: ${JSON.stringify(payload)}\n\n`;
    clients.forEach(client => {
        client.res.write(message);
    });
}
function getClientsCount() {
    return clients.length;
}
