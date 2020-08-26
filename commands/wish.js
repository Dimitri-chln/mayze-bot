module.exports = {
  name: "wish",
  description: "Wish des séries pour Mudae",
  aliases: [],
  args: 2,
  usage: "<série> <importance>",
  execute(message, args) {
    /* const stars = parseInt(args.splice(-1)[0], 10);
    if (isNaN(stars) || stars < 0 || stars > 5)
      return message.reply(
        "l'importance doit être un nombre entier compris entre 0 et 5"
      );
    const series = args.join(" ");
    const fs = require("fs");
    var wishDataString = fs.readFileSync("/app/database/wishes.json");
    var wishData = JSON.parse(wishData);
    var wishlist = wishData[message.author.id];
    if (!wishlist) wishlist = [];
    wishlist.push({ name: series, stars: stars });
    message.react("✅");
    wishData[message.author.id] = wishlist;
    wishDataString = JSON.stringify(wishData, null, 2);
    // fs.writeFileSync("../database/wishes.json", wishData);
    console.log(wishData); */
  }
};
