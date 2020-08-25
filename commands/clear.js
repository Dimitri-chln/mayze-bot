module.exports = {
  name: "clear",
  description: "Supprime plusieurs messages en même temps",
  aliases: ["clean"],
  cooldown: 5,
  args: 1,
  usage: "<nombre> [\"bot\"|mention/id] [-r <regex>]",
  execute(message, args) {
    const number = parseInt(args[0], 10);
    if (isNaN(number) || number <= 0 || number > 100) return message.reply("Le premier argument doit être un nombre entier compris entre 1 et 100!");
    message.channel.messages.fetch({"limit": number+1}).then(messages => {
      const userRegex = /<@!?\d{18}>/;
      var messagesToDelete = messages;
      if (args.length >= 2 && userRegex.test(args[1])) {
        messagesToDelete = messages.filter(msg => msg.author.id === args[1].replace(/[<@!>]/, ""));
      } else if (args [1] === "bot") {
        messagesToDelete = messages.filter(msg => msg.author.bot);
      } else if (args[1] === "-r" && args.length >= 3) {
        const regex = new RegExp(args[2], "i");
        messagesToDelete = messages.filter(msg => regex.test(msg));
      };
      message.channel.bulkDelete(messagesToDelete);
      message.channel.send(`${messagesToDelete.size} messages ont été supprimés !`)
      .then(m => m.delete(4000));
    });
  }
};
