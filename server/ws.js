//!-----ws
const webSocket = require("ws");
//settings
const WEB_SOCKET_PORT = 3001;
const webSocketServer = new webSocket.Server({ port: WEB_SOCKET_PORT });

const decoder = (message) => {
  const decoder = new TextDecoder("utf-8");
  const arr8 = new Uint8Array(message);
  return decoder.decode(arr8);
};

webSocketServer.broadcast = (data) => {
  webSocketServer.clients.forEach((client) => {
    if (client.readyState === webSocket.OPEN) {
      client.send(data);
    }
  });
};

webSocketServer.on("connection", (webSocket, req) => {
  console.log("Open webSocket connect");
  webSocketServer.broadcast(
    JSON.stringify({
      type: "usersOnline",
      usersOnline: webSocketServer.clients.size,
    })
  );

  // webSocket.on("message", (message) => {
  //   webSocketServer.clients.forEach((item) => {
  //     if (item.readyState === webSocket.OPEN) {
  //       const data = decoder(message);
  //       item.send(data);
  //       console.log(JSON.parse(data));
  //     }
  //   });
  // });
});

//!-----
