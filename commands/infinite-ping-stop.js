module.exports = {
    name: "infinite-ping-stop",
    description: "Stoppe un ping infini",
    aliases: ["infinitePingStop", "ipingstop"],
    args: 1,
    usage: "<mention>",
    perms: ["ADMINISTRATOR"],
    async execute(message, args) {
        const user = message.mentions.users.first();
        if (!user) return message.reply("mentionne une personne");
        if (!message.client.infinitePing || !message.client.infinitePing[user.id]) return message.reply("cette personne n'est pas en train d'être ping");
        delete message.client.infinitePing[user.id];
        message.react("✅");
    }
};