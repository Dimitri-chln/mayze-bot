module.exports = {
  name: "molkky",
  description: "Pour compter les points au molkky",
  aliases: ["mk"],
  args: 1,
  usage: "setup | create <joueur> <joueur> ... | score <score> | delete",
  execute(message, args) {
    const Discord = require("discord.js");
    const molkkyData = message.client.molkky.get(message.author.id);
    const Embed = new Discord.MessageEmbed()
      .setTitle(`Partie de ${message.author.username}`)
      .setColor("#010101")
      .setFooter("✨Mayze✨")
      .setTimestamp();

    switch (args[0]) {
      case "setup":
        const molkkySetup = require("../fixedData/images.json").molkky;
        message.channel.send({
          embed: {
            title: "Placement Mölkky",
            color: "#010101",
            image: {
              url: molkkySetup
            },
            footer: {
              text: "✨Mayze✨"
            }
          }
        });
        break;
      case "create":
        const players = args.splice(1);
        if (molkkyData) return message.reply(" une partie est déjà en cours");
        if (players.length < 2)
          return message.reply(
            "il faut au moins 2 joueurs pour lancer une partie"
          );
        const molkkyGame = {
          currentPlayer: 0,
          players: players.map(p => {
            return { name: p, scores: [0], failed: 0 };
          }),
          winners: []
        };
        message.channel.send({
          embed: Embed.setDescription(molkkyDesc(molkkyGame))
        });
        message.client.molkky.set(message.author.id, molkkyGame);
        break;
      case "score":
        if (!molkkyData) return message.reply("tu n'as pas de partie en cours");
        const points = parseInt(args[1], 10);
        if (isNaN(points)) return message.reply("le score doit être un nombre");
        if (points > 12 || points < 0)
          return message.reply("le score doit être compris entre 0 et 12");
        var newScore =
          molkkyData.players[molkkyData.currentPlayer].scores.slice(-1)[0] +
          points;
        if (points === 0) {
          molkkyData.players[molkkyData.currentPlayer].failed += 1;
        } else {
          molkkyData.players[molkkyData.currentPlayer].failed = 0;
        };
        if (molkkyData.players[molkkyData.currentPlayer].failed === 3)
          newScore = 0;
        if (newScore > 50) newScore = 25;
        if (newScore === 50)
          molkkyData.winners.push(
            molkkyData.players[molkkyData.currentPlayer].name
          );
        if (molkkyData.players[molkkyData.currentPlayer].failed === 3) {
          newScore = 0;
          molkkyData.players[molkkyData.currentPlayer].failed = 0;
        };
        molkkyData.players[molkkyData.currentPlayer].scores.push(newScore);
        var gameEnd = false;
        if (molkkyData.winners.length === molkkyData.players.length - 1) {
          message.client.molkky.delete(message.author.id);
          message.reply("la partie est terminée!");
          gameEnd = true;
        };
        do {
          molkkyData.currentPlayer += 1;
          if (molkkyData.currentPlayer === molkkyData.players.length)
            molkkyData.currentPlayer = 0;
        } while (
          molkkyData.players[molkkyData.currentPlayer].scores.slice(-1)[0] ===
          50
        );
        if (gameEnd)
          molkkyData.winners.push(
            molkkyData.players[molkkyData.currentPlayer].name
          );
        message.channel.send({
          embed: Embed.setDescription(molkkyDesc(molkkyData))
        });
        if (!gameEnd) message.client.molkky.set(message.author.id, molkkyData);
        break;
      case "delete":
        message.client.molkky.delete(message.author.id);
        message.reply("partie supprimée avec succès");
        break;
      default:
        message.reply("arguments incorrects !");
    };
    function molkkyDesc(molkkyData) {
      const embedDesc = `Joueur actuel: __***${
        molkkyData.players[molkkyData.currentPlayer].name
      }***__\`\`\`${molkkyData.players
        .map(
          p =>
            `${(p.name + "      ").substr(0, 7)}|${p.scores
              .map(s => (s + " ").substr(0, 2))
              .join("|")}`
        )
        .join(
          "\n" +
            "—".repeat(
              10 +
                3 * molkkyData.players[molkkyData.currentPlayer].scores.length
            ) +
            "\n"
        )}\`\`\`\nRésultats: \n${molkkyData.winners
        .map((w, i) => `\`${i + 1}.\` ${w}`)
        .join("\n") || "-"}`;
      return embedDesc;
    };
  }
};
