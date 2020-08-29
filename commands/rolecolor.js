module.exports = {
  name: "rolecolor",
  description: "Change la couleur d'un rôle",
  aliases: ["rolec", "rc"],
  args: 2,
  usage: "<rôle/id> <couleur>",
  perms: ["MANAGE_ROLES"],
  execute(message, args) {
    if (args.length >= 2) {
      const roleIdOrName = args[0].replace(/[<@&>\W]/g, "").toLowerCase();
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

      role.setColor(args[1]);
      message.channel.send({
        embed: {
          title: "Couleur modifiée avec succès",
          color: "#010101",
          description: `La couleur du rôle ${role} a été changée en ${args[1]}`,
          footer: {
            text: "✨Mayze✨"
          }
        }
      });
    }
  }
};
