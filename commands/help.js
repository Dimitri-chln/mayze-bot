module.exports = {
  name: "help",
  description: "Envoie un message d'aide contenant une liste de commandes",
  aliases: ["h", "aled"],
  args: 0,
  usage: "",
  execute(message, args) {
    const prefix = require("../config.json").prefix[message.client.user.id];
    message.channel.send({
      embed: {
        author: {
          name: "Message d'aide (pas du tout à jour mais flm)",
          icon_url: `https://cdn.discordapp.com/avatars/${message.client.user.id}/${message.client.user.avatar}.png`
        },
        color: "#010101",
        description: "__Commandes disponibles actuellement:__",
        fields: [
          {
            name: "🛠️ - Admin",
            value: `\`${prefix}rolecolor\`\n\`${prefix}message\`\n\`${prefix}clear\``,
            inline: true
          },
          {
            name: "🎉 - Fun",
            value: `\`${prefix}say\`\n\`${prefix}love\`\n\`${prefix}nude\`\n\`${prefix}molkky\`\n\`${prefix}russian-roulette\``,
            inline: true
          },
          {
            name: "🦅 - Pokémon",
            value: `\`${prefix}pokemon\`\n\`${prefix}pokedex\``,
            inline: true
          },
          {
            name: "❤️ - Gif",
            value: `\`${prefix}hug\`\n\`${prefix}kiss\``,
            inline: true
          },
          {
            name: "❔ - Autres",
            value: `\`${prefix}ping\`\n\`${prefix}uptime\`\n\`${prefix}role\`\n\`${prefix}commandhelp\`\n\`${prefix}ranks\`\n\`${prefix}rank\``,
            inline: true
          },
          {
            name: "🕹️ - Mudae",
            value: `\`${prefix}wish\`\n\`${prefix}wishlist\``,
            inline: true
          }
        ],
        footer: {
          text: "✨Mayze✨"
        }
      }
    });
  }
};
