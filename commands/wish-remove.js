module.exports = {
  name: "wish-remove",
  description: "Retire le wish d'une série pour Mudae",
  aliases: ["wishRemove", "wr"],
  args: 1,
  usage: "<n° série>",
  execute(message, args) {
    if (message.client.herokuMode) return message.reply("Cette commande est indisponible pour le moment (voir `*heroku`)");
    const dataRead = require("../functions/dataRead.js");
    const dataWrite = require("../functions/dataWrite.js");
    const wishData = dataRead("wishes.json");
    var wishlist = wishData[message.author.id] || [];
    const index = parseInt(args[0], 10);
    if (isNaN(index) || index <= 0 || index > wishlist.length)
      return message.reply(
        `l'argument doit être un nombre compris entre 1 et ${wishlist.length}`
      );
    wishlist = wishlist.filter((w, i) => i + 1 !== index);
    wishData[message.author.id] = wishlist;
    dataWrite("wishes.json", wishData);
    message.react("✅");
  }
};
