module.exports = {
  name: "help",
  description: "Envoie un message d'aide contenant une liste de commandes",
  aliases: ["h", "aled"],
  args: 0,
  usage: "",
  execute(message, args) {
    const prefix = require("../config.json").prefix;
    message.channel.send({
      embed: {
        title: "__Message d'aide__",
        color: "#010101",
        description: "Commandes disponibles actuellement:",
        fields: [
          {
            name: "🛠️ - Admin",
            value: `\`${prefix}rolecolor\`\n\`${prefix}role\`\n\`${prefix}message\`\n\`${prefix}clear\``,
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
            value: `\`${prefix}ping\`\n\`${prefix}uptime\`\n\`${prefix}commandhelp\``,
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
