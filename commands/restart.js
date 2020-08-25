module.exports = {
  name: "restart",
  description: "Redémarre complètement le bot",
  aliases: [],
  args: 0,
  usage: "",
  execute(message, args) {
    const config = require("../config.json");
    if (message.author.id === config.ownerID) {
      console.log("--------------------");
      console.log("BOT RESTART");
      message.channel
        .send("Bot is restarting...")
        .then(msg => message.client.destroy())
        .then(() => message.client.login(config.token));
    }
  }
};
