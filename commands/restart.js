module.exports = {
  name: "restart",
  description: "Redémarre complètement le bot",
  aliases: [],
  args: 0,
  usage: "",
  ownerOnly: true,
  execute(message, args) {
    console.log("--------------------");
    console.log("BOT RESTART");
    message.channel
      .send("Bot is restarting...")
      .then(msg => message.client.destroy())
      .then(() => message.client.login(process.env.TOKEN));
  }
};
