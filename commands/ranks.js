module.exports = {
  name: "ranks",
  description: "Donne la liste de tous les ranks",
  aliases: [],
  cooldown: 5,
  args: 0,
  usage: "",
  execute(message, args) {
    const roleTop = message.guild.roles.cache.get("735810286719598634");
    const roleBottom = message.guild.roles.cache.get("735810462872109156");
    const ranks = message.guild.roles.cache.filter(r => r.position < roleTop.position && r.position > roleBottom.position);
    message.channel.send({
      embed: {
        author: {
          name: "Ranks du serveur 🎗️",
          icon_url: `https://cdn.discordapp.com/avatars/${message.client.user.id}/${message.client.user.avatar}.png`
        },
        color: "#010101",
        description: ranks.map(rank => `• ${rank}`).join("\n"),
        footer: {
          text: "✨Mayze✨"
        }
      }
    });
  }
};