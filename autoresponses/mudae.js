module.exports = {
  execute(message) {
    // if (message.channel.id !== "672516067440197693") return;
    if (message.author.id !== "699901599509905429") return;
    if (!message.embeds.length) return;
    const mudaeEmbed = message.embeds[0];
    if (mudaeEmbed.color !== 16751916) return;
    const claimedRegex = new RegExp("(Animanga|Game) roulette", "");
    if (claimedRegex.test(mudaeEmbed.description)) return;
    const characterName = mudaeEmbed.author.name;
    const characterSeries = mudaeEmbed.description.split("\nClaims:")[0].replace(/\\n/g, " ");
    // wish detection
    const wishData = require("../database/wishes.json");
    const entries = Object.entries(wishData);
    for (const [user, wishes] of entries) {
      for (const wish of wishes) {
        const regex = new RegExp(wish.name, "i");
        if (regex.test(characterSeries)) {
          message.channel.send(
            `**${characterName}** est souhaité par <@${user}> !\n(${characterSeries})\nImportance: ${"❤️".repeat(
              wish.stars
            ) + "🖤".repeat(5 - wish.stars)}`
          );
        }
      }
    }
  }
};
