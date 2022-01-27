const Redis = require("ioredis");
//static
const channel = { notify: "notify", chat: "chat" };
const redis = new Redis();

redis.on("message", (c, message) => {
  if (c === channel.notify) {
    // msg = JSON.stringify({ cannel: c, message: JSON.parse(message) });
    console.log({ cannel: c, message: JSON.parse(message) });
  }
  if (c === channel.chat) {
    console.log({ cannel: c, message: JSON.parse(message) });
  }
});

function notify() {
  redis.subscribe([channel.notify, channel.chat], (error, count) => {
    if (error) {
      throw new Error(error);
    }
    console.log(`Subscribed to ${count} channel. Listening for updates on the ${channel} channel.`);
  });
}

module.exports = notify;
