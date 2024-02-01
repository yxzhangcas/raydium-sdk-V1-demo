import net from 'net';
import {
  CONN_HOST,
  CONN_PORT
} from './config';

export async function call_server(req_data: string, debug: boolean = false) {
  let socket = net.createConnection(CONN_PORT, CONN_HOST, () => {
    if (debug) console.log(`Connect to server ${CONN_HOST}:${CONN_PORT}`);
  });
  socket.write(req_data);
  socket.on('data', (data: Buffer) => {
    if (debug) console.log(JSON.parse(data.toString()));
    socket.end();
  });
  socket.on('end', () => {
    if (debug) console.log(`Disconnect from server ${CONN_HOST}:${CONN_PORT}`);
  })
}

export async function start_server(processData: (data: string) => void, debug = false) {
  let server = net.createServer();
  server.listen(CONN_PORT, CONN_HOST, () => {
    if (debug) console.log(`Start server ${CONN_HOST}:${CONN_PORT}`);
  });
  server.on('connection', socket => {
    if (debug) console.log('connection created by client');
    socket.on('data', (req_data) => {
      processData(req_data.toString());
      socket.write(JSON.stringify({ code: 'ok' }));
    });
    socket.on('end', () => {
      if (debug) console.log('connection ended by client');
    });
  });
}

