module.exports = {
    name: "unbelievaboat",
    description: "Commandes qui interagissent avec l'API d'Unbeliveboat",
    aliases: ["unb"],
    args: 0,
    usage: "[shop] [buy <objet>]",
    execute(message, args) {
        const unbAPI = require("unb-api");
        const unbClient = new unbAPI.Client(process.env.UNB_TOKEN);
        
        switch ((args[0] || "").toLowerCase()) {
            case "shop":
                const shop = require("../database/unbelievaboatShop.js");
                message.channel.send({
                    embed: {
                        author: {
                            name: `Shop Unbelievaboat`,
                            icon_url: `https://cdn.discordapp.com/avatars/${message.client.user.id}/${message.client.user.avatar}.png`
                        },
                        color: "#010101",
                        fields: shop.map(item => {
                            return { "name": `• ${item.name} - ✨${item.price}`, "value": `*${item.description}*`, "inline": true };
                        }),
                        footer: {
                            text: "✨ Mayze ✨"
                        }
                    }
                });
                break;
            case "buy":
                
                break;
            default:
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
                });
        };
    }
};