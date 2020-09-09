module.exports = {
  name: "jail",
  decription: "Met un membre en prison",
  aliases: [],
  cooldown: 5,
  args: 1,
  usage: "<mention>",
  perms: ["MANAGE_ROLES"],
  execute(message, args) {
    const user = message.mentions.users.first();
    const member = message.guild.members.cache.find(m => m.user === user);
    if (!user) return message.reply("mentionne la personne à mettre en prison");
    const roleTop = message.guild.roles.cache.get("735810286719598634");
    const roleBottom = message.guild.roles.cache.get("735810462872109156");
    const ranks = message.guild.roles.cache.filter(
      r =>
        r.position < roleTop.position &&
        r.position > roleBottom.position &&
        !r.name.includes("(Jailed)")
    );
    if (!member.roles.cache.some(r => r.id === "695943648235487263")) {
      const userRanks = ranks.filter(rank =>
        member.roles.cache.some(r => r.id === rank.id)
      );
      const jailedUserRanks = userRanks.map(function(userRank) {
        const jailedUserRank = message.guild.roles.cache.find(
          r => r.name === userRank.name + " (Jailed)"
        );
        if (!jailedUserRank)
          throw `The jailed rank for '${userRank.name}' doesn't exist`;
        return jailedUserRank;
      });

      userRanks.forEach(rank => member.roles.remove(rank.id));
      jailedUserRanks.forEach(jailedRank => member.roles.add(jailedRank.id));
      member.roles.add("695943648235487263");
      message.react("🔗");
    } else {
      const jailedUserRanks = member.roles.cache.filter(
        r => r.position < roleTop.position && r.position > roleBottom.position
      );
      const userRanks = jailedUserRanks.map(jailedUserRank =>
        ranks.find(r => r.name + " (Jailed)" === jailedUserRank.name)
      );

      userRanks.forEach(rank => member.roles.add(rank.id));
      jailedUserRanks.forEach(jailedRank => member.roles.remove(jailedRank.id));
      member.roles.remove("695943648235487263");
      message.react("👋");
    }
  }
};
