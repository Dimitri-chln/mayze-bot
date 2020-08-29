module.exports = {
  name: "message",
  description: "Envoie un message dans un salon",
  aliases: ["msg", "m"],
  args: 2,
  usage: "<channel> <texte>",
  perms: ["MANAGE_MESSAGES"],
  execute(message, args) {
    if (args.length >= 2) {
      var channel = message.client.channels.cache.get(
        args[0].replace(/[<#>]/g, "")
      );
      channel.send(args.splice(1).join(" "));
    } else {
      message.channel.send("Utilisation: `*message <channel> <text>`");
    };
  }
};
