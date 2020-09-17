module.exports = {
  name: "quest",
  description: "Affiche un message de vote pour les quêtes WWO",
  aliases: [],
  cooldown: 5,
  args: 0,
  usage: "[-everyone] [-single]",
  perms: ["ADMINISTRATOR"],
  execute(message, args) {
    if (
      !message.member.roles.cache.some(r =>
        ["696751614177837056", "696751852267765872"].includes(r.id)
      )
    )
      return;
    if (message.channel.id !== "689385764219387905") return;
    const questChannel = message.client.channels.cache.get(
      "689385764219387905"
    );
    const imageURL = (message.attachments.first() || {}).url;
    if (!imageURL) return message.reply("ajoute une image à ton message");
    const footerFlags = args.filter(a => a === "-everyone" || a === "-single");
    const footerFlagsString = ["Membres uniquement", "Plusieurs votes"];
    footerFlags.forEach(function(f) {
      if (f === "-everyone") footerFlagsString[0] = "Tout le monde";
      if (f === "-single") footerFlagsString[1] = "Un seul vote";
    });
    questChannel
      .send({
        content: "<@&689169027922526235>",
        embed: {
          title: "Nouvelles quêtes disponibles!",
          color: "#010101",
          image: {
            url: imageURL
          },
          footer: {
            text: footerFlagsString.join(" - ")
          }
        }
      })
      .then(msg => {
        msg.react("1️⃣");
        msg.react("2️⃣");
        msg.react("3️⃣");
        msg.react("🔁");
      })
      .then(() => {
        message.react("✅");
      });
  }
};
