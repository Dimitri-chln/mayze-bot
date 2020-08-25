module.exports = {
  name: "ping",
  description: "Pong!",
  aliases: ["pong"],
  args: 0,
  usage: "",
  execute(message, args) {
    message.channel.send(`Pong! ${message.client.ws.ping}ms`);
  }
};
