module.exports = {
    name: "unbelievaboat-balance",
    description: "Commandes qui interagissent avec l'API d'Unbeliveboat",
    aliases: ["unb-balance", "unbelievaboat-bal", "balance", "bal"],
    args: 0,
    usage: "",
    execute(message, args) {
        const unbAPI = require("unb-api");
        const unbClient = new unbAPI.Client(process.env.UNB_TOKEN);
        
        unbClient.getUserBalance(message.guild.id, message.author.id).then(user => {
            message.channel.send({
                embed: {
                    author: {
                        name: `Balance Unbelievaboat de ${message.author.username}`,
                        icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
                    },
                    color: "#010101",
                    description: `• Rang: **#${user.rank.toLocaleString()}**\n• Cash: **✨${user.cash.toLocaleString()}**\n• Bank: **✨${user.bank.toLocaleString()}**\n• Total: **✨${user.total.toLocaleString()}**`,
                    footer: {
                        text: "✨ Mayze ✨"
                    }
                }
            });
        }).catch(err => console.log(error));
    }
};