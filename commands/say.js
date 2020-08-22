module.exports = {
  name: "say",
  description: "Fais dire n'importe quoi au bot",
  aliases: [],
  args: 0,
  usage: "<texte>",
  execute(message, args) {
    message.channel.send(args.join(" "));
    message.delete();
  }
};
