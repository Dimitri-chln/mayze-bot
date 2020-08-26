module.exports = {
  name: "rolecolor",
  description: "Change la couleur d'un rôle",
  aliases: ["rolec", "rc"],
  args: 2,
  usage: "<rôle/id> <couleur>",
  perms: ["MANAGE_ROLES"],
  execute(message, args) {
    if (args.length >= 2) {
      const roleID = args[0].replace(/<@&|>/g, "");
      message.guild.roles.cache.get(roleID).setColor(args[1]);
      message.channel.send({
        embed: {
          title: "Couleur modifiée avec succès",
          color: "#010101",
          description: `La couleur du rôle <@&${roleID} a été changée en ${
            args[1]
          }`,
          footer: {
            text: "✨Mayze✨"
          }
        }
      });
    };
  }
};
