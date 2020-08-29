module.exports = {
  name: "wishlist",
  description: "Liste des wish pour Mudae",
  aliases: ["wl"],
  args: 0,
  usage: "[mention/id]",
  execute(message, args) {
    const wishData = require("../database/wishes.json");
    const user =
      message.mentions.users.first() ||
      message.client.users.cache.find(
        u =>
          u.id === args[0] ||
          u.username === args[0] ||
          u.username.includes(args[0])
      ) ||
      message.author;
    const wishlist = wishData[user.id];
    if (!wishlist) return message.reply("aucun wish trouvé !");
    message.channel.send({
      embed: {
        title: `Wishlist de ${
          message.client.users.cache.get(user.id).username
        }`,
        color: "#010101",
        description: wishlist
          .map(
            w =>
              "❤️".repeat(w.stars) +
              "🖤".repeat(5 - w.stars) +
              "\t" +
              w.name.split("|")[0]
          )
          .join("\n"),
        footer: {
          text: "✨Mayze✨"
        }
      }
    });
  }
};
