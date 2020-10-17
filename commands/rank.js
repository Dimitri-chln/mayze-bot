module.exports = {
  name: "rank",
  description: "Rejoins ou quitte un rank",
  aliases: [],
  cooldown: 5,
  args: 1,
  usage: "<rank>",
  execute(message, args) {
    if (message.member.roles.cache.some(r => r.id === "695943648235487263")) return;
    
    const roleTop = message.guild.roles.cache.get("735810286719598634");
    const roleBottom = message.guild.roles.cache.get("735810462872109156");
    const ranks = message.guild.roles.cache.filter(
      r =>
        r.position < roleTop.position &&
        r.position > roleBottom.position &&
        !r.name.includes("(Jailed)")
    );
    const rankIdOrName = args
      .join(" ")
      .replace(/[<@&>\W]/g, "")
      .toLowerCase();
    const rank =
      message.guild.roles.cache.get(rankIdOrName) ||
      ranks.find(r => r.name.replace(/[<@&>\W]/, "").toLowerCase() === rankIdOrName) ||
      ranks.find(r =>
        r.name
          .replace(/[<@&>\W]/, "")
          .toLowerCase()
          .includes(rankIdOrName)
      );

    if (!ranks.array().includes(rank))
      return message.reply("ce rank n'existe pas");

    if (!message.member.roles.cache.some(r => r.id === rank.id)) {
      message.member.roles
        .add(rank)
        .then(() => {
          message.channel.send(
            `${message.author} a rejoint le rank ${rank.name}`
          );
        })
        .catch(err => {
          message.reply("je n'ai pas pu te donner le rôle");
        });
    }
    if (message.member.roles.cache.some(r => r.id === rank.id)) {
      message.member.roles
        .remove(rank)
        .then(() => {
          message.channel.send(
            `${message.author} a quitté le rank ${rank.name}`
          );
        })
        .catch(err => {
          message.reply("je n'ai pas pu te retirer le rôle");
        });
    }
  }
};
