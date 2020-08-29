module.exports = {
  name: "role",
  description: "Obtiens des informations sur un rôle",
  aliases: [],
  args: 1,
  usage: "<rôle>",
  perms: ["MANAGE_ROLES"],
  execute(message, args) {
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
    
    const hexColor = `${(Math.floor(role.color / (256 * 256))).toString(16)}${(Math.floor((role.color % (256 * 256)) / 256)).toString(16)}${(role.color % 256).toString(16)}`;
    const roleMembers = message.guild.members.cache.filter(m => m.roles.cache.some(r => r.id === role.id)).map(m => m.user.username).join(", ");
    
    message.channel.send({
      embed: {
        author: {
          name: role.name,
          icon_url: `https://dummyimage.com/50/${hexColor}/${hexColor}`
        },
        color: "#010101",
        description: `**ID:** \`${role.id}\`\n**Couleur** (dec)**:** \`${role.color}\`\n**Couleur** (hex)**:** \`#${hexColor}\`\n**Position:** \`${role.rawPosition}\`\n**Membres:** \`\`\`${roleMembers}\`\`\``,
        footer: {
          text: "✨Mayze✨"
        }
      }
    });
  }
};
