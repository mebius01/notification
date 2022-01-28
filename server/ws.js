//!-----ws
const webSocket = require("ws");
const subscriber = require("./subscriber");
const uuid = require("uuid").v4;
//settings
const WEB_SOCKET_PORT = 3001;
const webSocketServer = new webSocket.Server({ port: WEB_SOCKET_PORT });

// const decoder = (message) => {
//   const decoder = new TextDecoder("utf-8");
//   const arr8 = new Uint8Array(message);
//   return decoder.decode(arr8);
// };

let wsConnectId = 0;

webSocketServer.broadcast = (data) => {
  console.log(Object.values(webSocketServer));
  //ws iteration clients
  webSocketServer.clients.forEach((client) => {
    //ws verify open and test id
    if (client.readyState === webSocket.OPEN && client.id === 2) {
      //send data
      client.send(data);
    }
  });
};

//ws connect
webSocketServer.on("connection", (wsConnect, req) => {
  //ws add id
  wsConnectId = wsConnectId + 1;
  wsConnect.id = wsConnectId;
  console.log("Open webSocket connect");

  //redis sub
  subscriber.on("message", (chanel, message) => {
    const msg = JSON.stringify({ chanel, message: JSON.parse(message) });
    webSocketServer.broadcast(msg);
  });
});

//!-----
