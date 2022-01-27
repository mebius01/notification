//static
const channel = { notify: "notify", chat: "chat" };
const pubMsg = (user) => {
  return {
    type: "notification",
    sender: 1,
    recipient: user.id,
    data: `Create New User ${user.name}`,
  };
};

module.exports = { channel, pubMsg };
