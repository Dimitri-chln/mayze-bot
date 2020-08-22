module.exports = {
  execute(message) {
    if (message.channel.id !== "672516067440197693") return;
    if (message.author.id !== "699901599509905429") return;
    if (!message.embeds.length) return;
    const mudaeEmbed = message.embeds[0];
    if (mudaeEmbed.color !== 16751916) return;
    if (mudaeEmbed.footer) return;
    const characterName = mudaeEmbed.author.name;
    const characterSerie = mudaeEmbed.description.split("\n")[0];
    console.log("// wish detection");
  }
};
