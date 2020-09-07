module.exports = {
  name: "role-all",
  description: "Donne ou retire un rôle à tous les membres",
  aliases: ["roleAll", "ra"],
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
        members.forEach(member => member.roles.add(role))
        message.channel.send(`${members.length} membres ont reçu le rôle ${role.name}`);
        break;
      case "remove":
        members.forEach(member => member.roles.remove(role))
        message.channel.send(`${members.length} membres ont perdu le rôle ${role.name}`);
        break;
      default:
        message.reply("arguments incorrects !")
    }
  }
};