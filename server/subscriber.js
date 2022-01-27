const Redis = require("ioredis");
const { channel } = require("./static");

const redis = new Redis();

redis.subscribe([channel.notify, channel.chat], (error, count) => {
  if (error) {
    throw new Error(error);
  }
  console.log(`Subscribed to ${count} channel. Listening for updates on the ${channel} channel.`);
});

module.exports = redis;
