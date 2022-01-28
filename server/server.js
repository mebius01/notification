const express = require("express");
const { db } = require("./db");
const bodyParser = require("body-parser");
const webSocket = require("ws");
const conf = require("./config");
const app = express();

// redis
const { publish } = require("./publisher");
const subscriber = require("./subscriber");

//!--------------------

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// controllers
app.post("/user", async (req, res, next) => {
  try {
    const { body } = req;
    const data = db.post(body);
    //! - redis publication
    await publish(data);
    //! -
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
});

app.get("/user", async (req, res, next) => {
  try {
    const data = db.list();
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
});

app.get("/user/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = db.get(id);
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
});

//!-----ws

const webSocketServer = new webSocket.Server({ noServer: true });
let wsConnectId = 0;

webSocketServer.broadcast = (data) => {
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
  //ws add id for verify ws client
  wsConnectId = wsConnectId + 1;
  wsConnect.id = wsConnectId;
  console.log(`New WS client ID:${wsConnect.id}`);

  //redis subscriber
  subscriber.on("message", (chanel, message) => {
    const msg = JSON.stringify({ chanel, message: JSON.parse(message) });
    webSocketServer.broadcast(msg);
  });
});

// start http server
// https://masteringjs.io/tutorials/express/websockets
app
  .listen(conf.HTTP_PORT, () => {
    console.log(`http run on port: ${conf.HTTP_PORT}`);
  })
  .on("upgrade", (request, socket, head) => {
    webSocketServer.handleUpgrade(request, socket, head, (socket) => {
      console.log(request);
      webSocketServer.emit("connection", socket, request);
    });
  });
