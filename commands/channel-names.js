module.exports = {
    name: "channel-names",
    description: "Modifie le nom de tous les salons en une seule commande",
    aliases: ["channelNames", "cn"],
    args: 2,
    usage: "<regex> <remplacement> [type]",
    perms: ["ADMINISTRATOR"],
    async execute(message, args) {
        const dataWrite = require("../functions/dataWrite.js");
        const channels = message.guild.channels.cache.filter(c => c.type === (args[2] || "text") || c.type === (args[2] || "voice")).sort(function(a, b) {
            return a.rawPosition - b.rawPosition;
        });
        const regex = new RegExp(args[0], "g");
        const replace = args[1];
        const newChannels = channels.map(c => c.name.replace(regex, replace));
        try {
            const msg = await message.channel.send({
                embed: {
                    author: {
                        name: "Vérification avant changement",
                        icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
                    },
                    thumbnail: {
                        url: `https://cdn.discordapp.com/avatars/${message.client.user.id}/${message.client.user.avatar}.png`
                    },
                    title: "• Voici à quoi ressembleront les salons après modification. Veux-tu continuer?",
                    color: "#010101",
                    description: newChannels.join("\n"),
                    footer: {
                        text: "✨ Mayze ✨"
                    }
                }
            });
            await msg.react("✅");
            await msg.react("❌");
            const filter = (reaction, user) => {
                return ["✅", "❌"].includes(reaction.emoji.name) && user.id === message.author.id;
            };
            try {
                const collected = await msg.awaitReactions(filter, {max: 1, time: 60000, errors: ["time"]});
                if (collected.first().emoji.name === "✅") {
                    var channelNames = {};
                    const loadingMsg = await message.channel.send(`Modification de ${channels.size} salons...`);
                    await channels.forEach(c => {
                        channelNames[c.id] = c.name;
                        try {
                            c.setName(c.name.replace(regex, replace));
                        } catch (err) {
                            console.log(err);
                        }
                    });
                    loadingMsg.edit(`${channels.size} salons ont été modifiés ! Tu peux revenir en arrière avec la commande \`*channel-back\``);
                    dataWrite("channelNames.json", channelNames);
                } else {
                    message.channel.send("Procédure annulée");
                }
            } catch (err) {
                message.channel.send("Procédure annulée");
            }
        } catch (err) {
            console.log(err);
            message.channel.send("Le message est trop long pour que je puisse l'envoyer :/");
        }
    }
};