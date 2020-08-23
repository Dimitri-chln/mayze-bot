module.exports = {
  name: "wishlist",
  description: "Liste des wish pour Mudae",
  aliases: ["wl"],
  args: 0,
  usage: "[mention/id]",
  execute(message, args) {
    const wishData = require("../database/wishes.json");
    const user = (args[0] || message.author.id).replace(/<@|>/g);
    const wishlist = wishData[user];
    if (!wishlist) return message.reply("aucun wish trouvé !");
    message.channel.send({
      embed: {
        title: `Wishlist de ${message.client.users.cache.get(user).username}`,
        color: "#010101",
        description: wishlist.map(w => "❤️".repeat(w.stars) + "🖤".repeat(5 - w.stars) + "\t" + w.name.split("|")[0]).join("\n"),
        footer: {
          text: "✨Mayze✨"
        }
      }
    });
  }
};
