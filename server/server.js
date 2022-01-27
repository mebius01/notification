const express = require("express");
const { db } = require("./db");
const bodyParser = require("body-parser");
const app = express();
require("express-ws")(app);

// redis
const { publish } = require("./publisher");
const subscriber = require("./subscriber");

//!--------------------
// settings
const port = 3000;

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

app.ws("/", (ws, req) => {
  subscriber.on("message", (chanel, message) => {
    ws.send(JSON.stringify({ chanel, message: JSON.parse(message) }));
  });
});

// server
app.listen(port, () => {
  console.log(`http server ${port}`);
});
