module.exports = {
  name: "clear",
  description: "Supprime plusieurs messages en même temps",
  aliases: ["clean"],
  cooldown: 5,
  args: 1,
  usage: "<nombre> [\"bot\"|mention/id] [-r <regex>]",
  execute(message, args) {
    const number = args[0];
    message.channel.messages.fetch({"limit": number}).then(messages => {
      const userRegex = /<@!?\d{18}>/;
      var messagesToDelete = messages;
      if (args.length >= 2 && userRegex.test(args[1]) {
        messagesToDelete = messages.filter(msg => msg.author.id === args[1].replace(/[<@!>]/, ""));
      } else if (args [1] === "bot") {
        messagesToDelete = messages.filter(msg => msg.author.bot);
      } else if (args[1] === "-r" && args.length >= 3) {
        const regex = args[2];
        messagesToDelete = messages.filter(msg => regex.test(msg));
      };
      message.channel.send(`${messageToDelete.length} messages ont été supprimés !\`\`\`${messagesToDelete.map(m => m.content).join("\n")}\`\`\``)
      //.then(m => m.delete());
    }).catch(err => {
      console.log("Error while doing bulk delete");
    });
  }
};
