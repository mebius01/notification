//!-----ws
const ws = require("ws");
//settings
const WEB_SOCKET_PORT = 3001;
const wss = new ws.Server({ port: WEB_SOCKET_PORT });

const decoder = (message) => {
  const decoder = new TextDecoder("utf-8");
  const arr8 = new Uint8Array(message);
  return decoder.decode(arr8);
};

wss.on("connection", (ws, req) => {
  console.log("Open WS connect");

  ws.on("message", (message) => {
    wss.clients.forEach((item) => {
      if (item.readyState === ws.OPEN) {
        const data = decoder(message);
        item.send(data);
        console.log(JSON.parse(data));
      }
    });
  });
});
//!-----
