module.exports = {
  name: "eval",
  description: "👀",
  aliases: [],
  cooldown: 0.1,
  args: 1,
  usage: "<expression>",
  ownerOnly: true,
  execute(message, args) {
    try {
      eval(args.join(" "));
    } catch (e) {
      message.channel.send(`__Error:__\`\`\`${e}\`\`\``);
    };
  }
};
