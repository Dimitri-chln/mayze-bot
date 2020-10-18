module.exports = {
  name: "kiss",
  description: "Fais un bisous à quelqu'un !",
  aliases: [],
  args: 1,
  usage: "<mention>",
  execute(message, args) {
    if (message.client.herokuMode) return message.reply("Cette commande est indisponible pour le moment (voir `*heroku`)");
    const images = require("../database/images.json");
    const user = message.mentions.users.first()|| message.client.user;
    message.channel.send({
      embed: {
        title: `${message.author.username} fait un bisous à ${user.username} 😘`,
        color: "#010101",
        image: {
          url: images.kisses[Math.floor(Math.random() * images.kisses.length)]
        },
        footer: {
          text: "✨Mayze✨"
        }
      }
    });
  }
};
