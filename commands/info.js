module.exports = {
  name: "info",
  description: "Montre quelques info sur le bot",
  aliases: ["i"],
  args: 0,
  usage: "",
  execute(message, args) {
    const config = require("../config.json");
    const version = require("../package.json").version;
    message.channel.send({
      embed: {
        author: {
          name: message.client.user.username,
          icon_url: `https://cdn.discordapp.com/avatars/${message.client.user.id}/${message.client.user.avatar}.png`
        },
        title: "• Informations sur le bot",
        color: "#010101",
        description: `**Préfixe:** \`${config.prefix[message.client.user.id]}\`\n**Propriétaire:** \`${message.client.users.cache.get(config.ownerID).username}\`\n**Version:** \`${version}\``,
        footer: {
          text: "✨Mayze✨"
        }
      }
    });
  }
}