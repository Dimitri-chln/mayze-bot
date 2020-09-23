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

    if (
      member.roles.highest.position >= message.member.roles.highest.position &&
      !(
        member.id === "394633964138135563" &&
        message.author.id === "394633964138135563"
      )
    )
      return message.reply("tu ne peux pas mettre cette personne en prison");

    const roleTop = message.guild.roles.cache.get("735810286719598634");
    const roleBottom = message.guild.roles.cache.get("735810462872109156");
    const ranks = message.guild.roles.cache.filter(
      r => r.position < roleTop.position && r.position > roleBottom.position
    );

    if (!member.roles.cache.some(r => r.id === "695943648235487263")) {
      // if not jailed
      member.roles
        .add("695943648235487263")
        .catch(e => message.channel.send("Le rôle jailed n'existe plus"));
      const notJailedRanks = ranks.filter(r => !r.name.includes("(Jailed)"));
      notJailedRanks.forEach(rank => {
        const jailedRank =
          ranks.find(r => r.name === rank.name + " (Jailed)") || {};
        if (member.roles.cache.some(role => role.id === rank.id)) {
          member.roles.remove(rank.id);
          member.roles
            .add(jailedRank.id)
            .catch(e =>
              message.channel.send(
                `Je n'ai pas trouvé le rôle correspondant au rank "${rank.name}"`
              )
            );
        }
      });
      if (member.roles.cache.some(r => r.id === "689180158359371851")) {
        // Administrateur
        member.roles.remove("689180158359371851");
        member.roles.add("753245162469064795");
      }
      if (member.roles.cache.some(r => r.id === "737646140362850364")) {
        // Modérateur
        member.roles.remove("737646140362850364");
        member.roles.add("753250476891439185");
      }
      if (member.roles.cache.some(r => r.id === "696751614177837056")) {
        // Sous Chef
        member.roles.remove("696751614177837056");
        member.roles.add("753251533768097933");
      }
      if (member.roles.cache.some(r => r.id === "689218691560505472")) {
        // 👑🐍•🐣✨•🌙🐒•⚡🦅•🦄❄️
        member.roles.remove("689218691560505472");
        member.roles.add("753253307052589176");
      }
      message.react("🔗");
    } else {
      // if jailed
      member.roles
        .remove("695943648235487263")
        .catch(e => message.channel.send("Le rôle jailed n'existe plus"));
      const jailedRanks = ranks.filter(r => r.name.includes("(Jailed)"));
      jailedRanks.forEach(rank => {
        const notJailedRank =
          ranks.find(r => r.name + " (Jailed)" === rank.name) || {};
        if (member.roles.cache.some(role => role.id === rank.id)) {
          member.roles.remove(rank.id);
          member.roles
            .add(notJailedRank.id)
            .catch(e =>
              message.channel.send(
                `Je n'ai pas trouvé le rôle correspondant au rank "${rank.name}"`
              )
            );
        }
      });
      if (member.roles.cache.some(r => r.id === "753245162469064795")) {
        // Administrateur
        member.roles.remove("753245162469064795");
        member.roles.add("689180158359371851");
      }
      if (member.roles.cache.some(r => r.id === "753250476891439185")) {
        // Modérateur
        member.roles.remove("753250476891439185");
        member.roles.add("737646140362850364");
      }
      if (member.roles.cache.some(r => r.id === "753251533768097933")) {
        // Sous Chef
        member.roles.remove("753251533768097933");
        member.roles.add("696751614177837056");
      }
      if (member.roles.cache.some(r => r.id === "753253307052589176")) {
        // 👑🐍•🐣✨•🌙🐒•⚡🦅•🦄❄️
        member.roles.remove("753253307052589176");
        member.roles.add("689218691560505472");
      }
      message.react("👋");
    }
  }
};
