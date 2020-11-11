module.exports = {
    name: "mass-ping",
    description: "Ping une personne en boucle",
    aliases: ["massping"],
    args: 1,
    usage: "<mention> [nombre]",
    perms: ["MANAGE_MESSAGES"],
    async execute(message, args) {
        const user = message.mentions.users.first();
        const n = parseInt(args[1], 10) || 10;
        message.delete();
        if (isNaN(n) || n < 0 || n > 100) return message.reply("le nombre doit être compris entre 0 et 100");
        for (i=0; i<n; i++) {
            message.channel.send(`${user}`).then(async m => {
                m.delete();
            });
        };
    }
};