module.exports = {
  name: "message",
  description: "Envoie un message dans un salon",
  aliases: ["msg", "m"],
  args: 2,
  usage: "<salon> <texte>",
  perms: ["MANAGE_MESSAGES"],
  execute(message, args) {
    if (args.length >= 2) {
      const channel = message.client.channels.cache.get(args[0].replace(/[<#>]/g, ""));
      channel.send(args.splice(1).join(" "));
    } else {
      message.channel.send("Utilisation: `*message <channel> <text>`");
    };
  }
};
