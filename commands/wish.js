module.exports = {
  name: "wish",
  description: "Wish des séries pour Mudae",
  aliases: [],
  args: 1,
  usage: "[série]",
  execute(message, args) {
    /* const fs = require("fs");
    const wishData = fs.readFileSync("../database/wishes.json");
    wishData = JSON.parse(wishData);
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