module.exports = {
  name: "wish-remove",
  description: "Retire le wish d'une série pour Mudae",
  aliases: ["wishRemove", "wr"],
  args: 1,
  usage: "<série>",
  execute(message, args) {
    const wishData = message.client.dataRead("wishes.json");
    const series = args.join(" ");
    var wishlist = wishData[message.author.id] || [];
    wishlist = wishlist.filter(w => w !== series)
    wishData[message.author.id] = wishlist;
    message.client.dataWrite("wishes.json", wishData);
    message.react("✅");
  }
};