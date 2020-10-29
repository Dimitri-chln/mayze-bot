module.exports = {
    execute(message) {
        if (message.author.bot) return;
        const regex = /https:\/\/(?:cdn\.)?discord(?:app)?\.com\/channels\/(\d{18})\/(\d{18})\/(\d{18})/;
        if (!regex.test(message.content)) return;
        const IDs = message.content.replace(regex, "$1 $2 $3").split(" ");
        if (message.guild.id !== IDs[0]) return;
        const channel = message.client.channels.cache.get(IDs[1]);
        channel.messages.fetch(IDs[2]).then(msg => {
            if (msg.embeds.length) return;
            message.channel.send({
                embed: {
                    author: {
                        name: msg.author.username,
                        icon_url: `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png`
                    },
                    title: `#${channel.name}`,
                    color: "#010101",
                    description: msg.content,
                    image: {
                        url: msg.attachments.first().url
                    },
                    footer: {
                        text: `Cité par ${message.author.username}`
                    },
                    timestamp: new Date(msg.createdTimestamp)
                }
            });
        });
    }
};