module.exports = {
    name: "kiss",
    description: "Fais un bisous à quelqu'un !",
    aliases: [],
    args: 1,
    usage: "<mention>",
    execute(message, args) {
        const images = require("../fixedData/images.json");
        if (args.length >= 1){
            var kiss = message.guild.members.cache.get(args[0].replace(/<@!?|>/g,""));
            if (kiss){
                message.channel.send({
                    embed: {
                        title: `${message.author.username} fait un bisou à ${kiss.user.username} 😘`,
                        color: "#010101",
                        image: {
                            url: images.kisses[Math.floor(Math.random()*images.kisses.length)]
                        },
                        footer: {
                            text: "✨Mayze✨"
                        }
                    }
                });
            };
        };
    }
};