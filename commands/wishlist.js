module.exports = {
  name: "wishlist",
  description: "Liste des wish pour Mudae",
  aliases: ["wl"],
  args: 0,
  usage: "[mention/id]",
  execute(message, args) {
    const fs = require("fs");
    const wishData = JSON.parse(fs.readFileSync("database/wishes.json"));
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
        author: {
          name: `Wishlist de ${
            message.client.users.cache.get(user.id).username
          }`,
          icon_url: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
        },
        color: "#010101",
        description: wishlist.map((w, i) => `\`${i + 1}.\` ${w.split("|")[0]}`).join("\n"),
        footer: {
          text: "✨Mayze✨"
        }
      }
    });
  }
};
