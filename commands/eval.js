module.exports = {
  name: "eval",
  description: "👀",
  aliases: [],
  cooldown: 0,
  args: 1,
  usage: "<expression>",
  execute(message, args) {
    const ownerID = require("../config.json").ownerID;
    if (message.author.id === ownerID) {
      try {
        eval(args.join(" "));
      } catch (e) {
        message.channel.send(`__Error:__\`\`\`${e}\`\`\``);
      }
    }
  }
};
