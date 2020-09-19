module.exports = {
  name: "wish",
  description: "Wish des séries pour Mudae",
  aliases: [],
  args: 1,
  usage: "<série>",
  execute(message, args) {
    const wishData = message.client.dataRead("wishes.json");
    const series = args.join(" ");
    const wishlist = wishData[message.author.id] || [];
    wishlist.push(series)
    wishData[message.author.id] = wishlist;
    message.client.dataWrite("wishes.json", wishData);
    message.react("✅");
  }
};
