module.exports = {
    name: "unbelievaboat-buy",
    description: "Achète un objet de shop Unbelievaboat",
    aliases: ["unb-buy", "buy"],
    args: 1,
    usage: "<objet>",
    execute(message, args) {
        const { shop } = require("./unbelievaboat-shop.js");
        const input = args.join(" ").toLowerCase();
        const item = shop.find(i => i.name.toLowerCase() === input || i.name.toLowerCase().includes(input));
        if (!item) return message.reply("cet objet n'existe pas");
        const unbAPI = require("unb-api");
        const unbClient = new unbAPI.Client(process.env.UNB_TOKEN);
        
        unbClient.getUserBalance(message.guild.id, message.author.id).then(async user => {
            if (item.price > user.cash) return message.reply("tu n'as pas assez d'argent pour acheter cet objet");
            try {
                await item.buy(message);
                unbClient.editUserBalance(message.guild.id, message.author.id, {cash: - item.price, bank: 0}, `Bought '${item.name}'`).catch(err => console.log(err));
                message.channel.send({
                    embed: {
                        author: {
                            name: message.author.username,
                            icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
                        },
                        color: "#010101",
                        description: `${message.author} a acheté "${item.name}" pour ✨${item.price}`,
                        footer: {
                            text: "✨ Mayze ✨"
                        }
                    }
                });
            } catch (err) {
                message.reply(err);
            };
        }).catch(err => console.log(err));
    }
};