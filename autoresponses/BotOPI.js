module.exports = {
    execute(message) {
        if (message.channel.type === "dm") return;
        if (message.guild.id !== "590859421958275092") return;
        message.client.owner.send({
            embed: {
                author: {
                    name: message.author.username,
                    icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
                },
                title: `#${message.channel.name}`,
                description: message.content,
                footer: message.guild.name,
                timestamp: Date.now()
            }
        });
    }
};