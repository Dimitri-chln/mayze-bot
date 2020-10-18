module.exports = {
  name: "wish",
  description: "Wish des séries pour Mudae",
  aliases: [],
  args: 1,
  usage: "<série>",
  execute(message, args) {
    if (message.client.herokuMode) return message.reply("Cette commande est indisponible pour le moment (voir `*heroku`)");
    const dataRead = require("../functions/dataRead.js");
    const dataWrite = require("../functions/dataWrite.js");
    const wishData = dataRead("wishes.json");
    const series = args.join(" ");
    const wishlist = wishData[message.author.id] || [];
    wishlist.push(series)
    wishData[message.author.id] = wishlist;
    dataWrite("wishes.json", wishData);
    message.react("✅");
  }
};
