module.exports = {
  name: "nude",
  description: "Miam 😏",
  aliases: ["miam"],
  cooldown: 600,
  args: 0,
  usage: "",
  execute(message, args) {
    if (message.client.herokuMode) return message.reply("Cette commande est indisponible pour le moment (voir `*heroku`)");
    const images = require("../database/images.json");
    message.react("😏");
    message.author.send({
      embed: {
        title: "Miam 😏",
        color: "#010101",
        image: {
          url: images.nudes[Math.floor(Math.random() * images.nudes.length)]
        },
        footer: {
          text: "✨Mayze✨"
        }
      }
    });
  }
};
