const Redis = require("ioredis");
//static
const { channel, pubMsg } = require("./static");

const publish = async (data) => {
  const pub = new Redis();
  await pub.publish(channel.notify, JSON.stringify(pubMsg(data)));
  pub.disconnect();
};

module.exports = { publish };
