import net from 'net';
import { WebSocket, WebSocketServer } from 'ws';
import fs from 'fs';

const TCP_PORT = parseInt(process.env.TCP_PORT || '12000', 10);

const tcpServer = net.createServer();
const websocketServer = new WebSocketServer({ port: 8080 });
const batteryOperatingRange = [20, 80];

const alertsQueue: Array<number> = [];
const myConsole = new console.Console(fs.createWriteStream('./incidents.log'));

function checkOperatingRange(temperature: number): boolean {
  return temperature > batteryOperatingRange[0] && 
    temperature < batteryOperatingRange [1];
}

tcpServer.on('connection', (socket) => {
    console.log('TCP client connected');
    
    socket.on('data', (msg) => {
        console.log(msg.toString());


        // HINT: what happens if the JSON in the received message is formatted incorrectly?
        // HINT: see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch

        // See if message being passed can be parsed as a JSON, else skip it
        try {
          console.log
          let currJSON = JSON.parse(msg.toString());

          let timestamp = currJSON["timestamp"]

          console.log(alertsQueue);

          while (alertsQueue.length > 0 && alertsQueue[0] < timestamp - 5000) {
            alertsQueue.shift();
          }

          if (!checkOperatingRange(currJSON["battery_temperature"])) {
            alertsQueue.push(timestamp)
          }

          if (alertsQueue.length > 3) {
            myConsole.log("alert @", timestamp);
          }

          websocketServer.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
              client.send(msg.toString());
              // are we meant to do something with currJSON?
            }
          });

        } catch (e) {
          if (e instanceof SyntaxError) {
            console.log("error in parsing message")
          }  
        }
    });

    socket.on('end', () => {
        console.log('Closing connection with the TCP client');
    });
    
    socket.on('error', (err) => {
        console.log('TCP client error: ', err);
    });
});

websocketServer.on('listening', () => console.log('Websocket server started'));

websocketServer.on('connection', async (ws: WebSocket) => {
    console.log('Frontend websocket client connected to websocket server');
    ws.on('error', console.error);  
});

tcpServer.listen(TCP_PORT, () => {
    console.log(`TCP server listening on port ${TCP_PORT}`);
});


