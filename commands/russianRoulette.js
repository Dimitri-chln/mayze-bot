module.exports = {
  name: "russian-roulette",
  description: "Joue à la roulette russe",
  aliases: ["rr"],
  args: 1,
  usage: "create/join/start",
  execute(message, args) {
    const shuffle = require("../functions/shuffle.js");
    const prefix = require("../config.json").prefix[message.client.user.id];
    switch (args[0]) {
      case "create":
        if (message.client.russianRoulette.length)
          return message.reply("une partie est déjà en cours!");
        message.client.russianRoulette.push(message.author.id);
        message.channel.send({
          embed: {
            author: {
              name: "Une partie de roulette russe a été lancée!",
              icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
            },
            color: "#010101",
            description:
              "Rejoins la partie avec la commande `${prefix]russian-roulette join` !",
            footer: {
              text: "✨Mayze✨"
            }
          }
        });
        break;
      case "join":
        if (!message.client.russianRoulette.length)
          return message.reply(
            "il n'y a pas de partie en cours! Crée une partie avec la commande `${prefix}russian-roulette create`"
          );
        if (message.client.russianRoulette.includes(message.author.id))
          return message.reply("tu as déjà rejoint cette partie");
        message.client.russianRoulette.push(message.author.id);
        message.channel.send(`<@${message.author.id}> a rejoint la partie`);
        break;
      case "start":
        if (!message.client.russianRoulette.length)
          return message.reply(
            "il n'y a pas de partie en cours! Crée une partie avec la commande `${prefix}russian-roulette create`"
          );
        if (message.client.russianRoulette.length < 2)
          return message.reply(
            "il faut au minimum 2 joueurs pour lancer la partie"
          );
        if (
          message.client.russianRoulette[0] !== message.author.id &&
          !message.member.hasPermission("KICK_MEMBERS")
        )
          return message.reply(
            "seule la personne qui a créé la partie peut la lancer"
          );
        const players = message.client.russianRoulette;
        const Discord = require("discord.js");
        const Embed = new Discord.MessageEmbed()
          .setAuthor("La partie de roulette russe a commencé!", `https://cdn.discordapp.com/avatars/${message.author.id}/${message.authoravatar}.png`)
          .setColor("#010101")
          .setFooter("✨Mayze✨")
          .setTimestamp();
        message.channel
          .send({
            embed: Embed.setDescription("...")
          })
          .then(msg => {
            const deadPlayer =
              players[Math.floor(Math.random() * players.length)];
            var alivePlayers = players.filter(p => p !== deadPlayer);
            shuffle(alivePlayers);
            roulette(msg, alivePlayers, deadPlayer, Embed, 0);
          });
        message.client.russianRoulette = [];
        break;
      default:
        message.reply("Utilisation: `${prefix}russian-roulette create/join/start`");
    }

    function roulette(msg, alivePlayers, deadPlayer, Embed, i) {
      if (alivePlayers.length > 0 && i < 5) {
        setTimeout(function() {
            msg.edit({
              embed: Embed.setDescription(
                `${message.client.users.cache.get(alivePlayers.pop()).username} ...`
              )
            });
            roulette(msg, alivePlayers, deadPlayer, Embed, i+1)
        }, 2000);
      } else {
        setTimeout(function() {
          msg.edit({
            embed: Embed.setDescription(
              `🔫 ${
                message.client.users.cache.get(deadPlayer).username
              } est mort !`
            )
          });
          message.guild.members.cache.get(deadPlayer).kick("Roulette Russe").catch(() => {
            message.channel.send("Je n'ai pas pu expulser le perdant");
          });
        }, 2000);
      }
    }
  }
};
