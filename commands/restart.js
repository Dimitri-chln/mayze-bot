module.exports = {
  name: "restart",
  description: "Redémarre complètement le bot",
  aliases: [],
  args: 0,
  usage: "",
  ownerOnly: true,
  execute(message, args) {
    console.log("----- BOT RESTART -----");
    message.channel.send("Bot is restarting...");
    const shellExec = require("../functions/shellExec.js");
    shellExec("node .");
    process.exit(1);
  }
};
