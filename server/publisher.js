const Redis = require("ioredis");
//static
const channel = { notify: "notify", chat: "chat" };

const pubMsg = (user) => {
  return {
    type: "notification",
    sender: 1,
    recipient: user.id,
    data: { ...user },
  };
};

const publish = async (data) => {
  const pub = new Redis();
  await pub.publish(`${channel.notify}`, JSON.stringify(pubMsg(data)));
  pub.disconnect();
};

module.exports = { publish };
