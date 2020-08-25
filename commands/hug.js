module.exports = {
  name: "hug",
  description: "Fais un câlin à quelqu'un !",
  aliases: [],
  args: 1,
  usage: "<mention>",
  execute(message, args) {
    const images = require("../fixedData/images.json");
    if (args.length >= 1) {
      var hug = message.guild.members.cache.get(args[0].replace(/[<@!>]/g, ""));
      if (hug) {
        message.channel.send({
          embed: {
            title: `${message.author.username} fait un câlin à ${hug.user.username} 🤗`,
            color: "#010101",
            image: {
              url: images.hugs[Math.floor(Math.random() * images.hugs.length)]
            },
            footer: {
              text: "✨Mayze✨"
            }
          }
        });
      }
    }
  }
};
