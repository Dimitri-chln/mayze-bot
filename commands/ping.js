module.exports = {
  name: "ping",
  description: "Pong!",
  aliases: ["pong"],
  args: 0,
  usage: "",
  execute(message, args) {
    message.channel
      .send("Pinging...")
      .then(msg =>
        msg.edit(`Pong! **${Math.abs(Date.now() - msg.createdTimestamp)}**ms`)
      );
  }
};
