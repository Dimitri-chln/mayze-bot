module.exports = {
  name: "to-do",
  description: "Liste des commandes/fix à faire pour le bot",
  aliases: ["toDo", "td"],
  args: 0,
  usage: "[add/remove <tâche>]",
  ownerOnly: true,
  execute(message, args) {
    const toDo = message.client.dataRead("toDo.json");
    if (!args.length) {
      message.channel.send({
        embed: {
          author: {
            name: "To-do list pour ✨Mayze✨",
            icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
          },
          color: "#010101",
          description: toDo.map((t, i) => `\`${i + 1}.\` ${t}`).join("\n"),
          footer: {
            text: "✨Mayze✨"
          }
        }
      });
    }

    if (args[0] === "add") {
      toDo.push(args.splice(1).join(" "));
      const newToDo = toDo;
      message.client.dataWrite("toDo.json", newToDo);
      message.react("✅");
    }

    if (args[0] === "remove") {
      const index = parseInt(args[1], 10);
      if (isNaN(index) || index <= 0 || index > toDo.length)
        return message.reply(
          `le deuxième argument doit être un nombre compris entre 1 et ${toDo.length}`
        );
      const newToDo = toDo.filter((t, i) => i + 1 !== index);
      message.client.dataWrite("toDo.json", newToDo);
      message.react("✅");
    }
  }
};
