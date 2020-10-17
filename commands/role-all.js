module.exports = {
  name: "role-all",
  description: "Donne ou retire un rôle à tous les membres",
  aliases: ["ra"],
  cooldown: 30,
  args: 2,
  usage: "add/remove <rôle> [-bot] [-human]",
  perms: ["MANAGE_ROLES"],
  execute(message, args) {
    const roleIdOrName = args[1].replace(/[<@&>\W]/g, "").toLowerCase();
    const role =
      message.guild.roles.cache.get(roleIdOrName) ||
      message.guild.roles.cache.find(
        r => r.name.replace(/[<@&>\W]/, "").toLowerCase() === roleIdOrName
      ) ||
      message.guild.roles.cache.find(r =>
        r.name
          .replace(/[<@&>\W]/, "")
          .toLowerCase()
          .includes(roleIdOrName)
      );
    if (!role) return message.reply("je n'ai pas réussi à trouver ce rôle");

    var members = message.guild.members.cache.array();

    if (args.includes("-bot")) {
      members = members.filter(m => m.user.bot);
    }
    if (args.includes("-human")) {
      members = members.filter(m => !m.user.bot);
    }

    switch (args[0]) {
      case "add":
        members = members.filter(
          m => !m.roles.cache.some(r => r.id === role.id)
        );
        members.forEach(member => member.roles.add(role));
        break;
      case "remove":
        members = members.filter(m =>
          m.roles.cache.some(r => r.id === role.id)
        );
        members.forEach(member => member.roles.remove(role));
        break;
      default:
        return message.reply("arguments incorrects !");
    }
    message.channel.send(
      `Le rôle \`${role.name}\` a été mis à jour pour ${members.length} membre(s)`
    );
  }
};
