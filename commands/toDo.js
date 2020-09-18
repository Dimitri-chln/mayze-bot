module.exports = {
  name: "to-do",
  description: "Liste des commandes/fix à faire pour le bot",
  aliases: ["toDo", "td"],
  args: 0,
  usage: "[add/remove <tâche>]",
  ownerOnly: true,
  execute(message, args) {
    const fs = require("fs");
    const toDo = JSON.parse(fs.readFileSync("database/toDo.json"));
    if (!args.length) {
      message.channel.send({
        embed: {
          author: {
            name: "To-do list pour ✨Mayze✨",
            icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
          },
          color: "#010101",
          description: toDo.map(t => "• " + t).join("\n"),
          footer: {
            text: "✨Mayze✨"
          }
        }
      });
    }
    
    if (args[0] === "add") {
      
    }
    
    if (args[0] === "remove") {
      
    }
  }
};