module.exports = {
    name: "infinite-ping",
    description: "Ping une personne indéfiniment dans un salon",
    aliases: ["infinitePing", "iping"],
    args: 1,
    usage: "<mention>",
    perms: ["ADMINISTRATOR"],
    async execute(message, args) {
        const user = message.mentions.users.first();
        if (!user) return message.reply("mentionne une personne");
        if (!message.client.infinitePing) message.client.infinitePing = {};
        message.client.infinitePing[user.id] = true;
        while (message.client.infinitePing[user.id]) {
            for (i = 0; i < 5; i++) {
                await message.channel.send(`${user}`);
            }
        }
    }
};