module.exports = {
  name: "message",
  description: "Envoie un message dans un salon",
  aliases: ["msg", "m"],
  args: 2,
  usage: "<channel> <texte>",
  execute(message, args) {
    if (message.member.hasPermission("ADMINISTRATOR")) {
      if (args.length >= 2) {
        var channel = message.client.channels.cache.get(
          args[0].replace(/<#|>/g, "")
        );
        channel.send(args.splice(1).join(" "));
      } else {
        message.channel.send("Utilisation: `*message <channel> <text>`");
      }
    }
  }
};
