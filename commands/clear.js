module.exports = {
  name: "clear",
  description: "Supprime plusieurs messages en même temps",
  aliases: ["clean", "cl"],
  cooldown: 5,
  args: 1,
  usage: "<nombre> [mention/id] [-bot / -r <regex>]",
  perms: ["MANAGE_MESSAGES"],
  execute(message, args) {
    const number = parseInt(args[0], 10);
    if (isNaN(number) || number <= 0 || number > 100)
      return message.reply(
        "le premier argument doit être un nombre entier compris entre 1 et 100!"
      );
    message.delete().then(() => {
      message.channel.messages.fetch({ limit: 100 }).then(messages => {
        var messagesToDelete = messages;

        if (message.mentions.users.size) {
          const user = message.mentions.users.first();
          messagesToDelete = messagesToDelete.filter(
            msg => msg.author === user
          );
        }

        if (args.includes("-bot")) {
          messagesToDelete = messagesToDelete.filter(msg => msg.author.bot);
        }

        if (args.includes("-r")) {
          const regex = new RegExp(
            args[args.lastIndexOf("-r") + 1] || ".",
            "i"
          );
          messagesToDelete = messagesToDelete.filter(msg => regex.test(msg));
        }

        messagesToDelete = messagesToDelete.first(number);
        message.channel.bulkDelete(messagesToDelete);
        var response = `${messagesToDelete.length} messages ont été supprimés`;
        if (messagesToDelete.length === 1)
          response = "1 message a été supprrimé";
        if (messagesToDelete.length === 0)
          response = "Aucun message n'a été supprimé";
        message.channel.send(response).then(m => m.delete({ timeout: 4000 }));
      });
    });
  }
};
