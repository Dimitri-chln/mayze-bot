module.exports = {
  name: "wish",
  description: "Wish des séries pour Mudae",
  aliases: [],
  args: 2,
  usage: "<série> <importance>",
  execute(message, args) {
    const stars = parseInt(args.splice(-1)[0], 10);
    if (isNaN(stars) || stars < 0 || stars > 5) return message.reply("l'importance doit être un nombre entier compris entre 0 et 5");
    const series = args.splice(args.length-1, 1).join(" ");
    console.log({"série":series,"stars":stars});
    /* const fs = require("fs");
    const wishDataString = fs.readFileSync("../database/wishes.json");
    const wishData = JSON.parse(wishData);
    const wishlist = wishData[message.author.id];
    if (!wishlist) wishlist = [];
    wishlist.push(args.join(" "));
    message.react("✅");
    wishData[message.author.id] = wishlist;
    wishData = JSON.stringify(wishData, null, 2);
    fs.writeFileSync("../database/wishes.json", wishData);
    console.log(wishData); */
  }
};