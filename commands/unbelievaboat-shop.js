module.exports = {
    name: "unbelievaboat-shop",
    description: "Liste des objets à vendre",
    aliases: ["unb-shop", "shop"],
    args: 0,
    usage: "",
    shop: [
        {
            name: "Visite de prison",
            description: "Achète un billet te permettant de passer tes vacances au goulag",
            price: 10000,
            async buy(message) {
                const jail = require("../commands/jail.js");
                message.channel.send(`*jail ${message.author}`).then(msg => {
                    jail.execute(msg, []);
                });
            }
        },
        {
            name: "Mute à double tranchant",
            description: "Choisis une personne. Un de vous deux sera mute pendant 10 minutes",
            price: 7500,
            async buy(message) {
                const muteRole = message.guild.roles.cache.get("695330946844721312");
                const user = message.mentions.users.first();
                const filter = function(response) {
                    return /<@!?\d{18}>/.test(response.content) && response.author.id === message.author.id;
                };
                const msg = await message.reply("mentionne la personne que tu veux mute");
                message.channel.awaitMessages(filter, {max: 1, time: 60000, errors: ["time"]})
                .then(collected => {
                    const user = collected.first().mentions.users.first();
                    msg.delete();
                    collected.first().delete();
                    const r = Math.random() * 2;
                    var muted = message.member;
                    if (r < 1) {
                        muted = message.guild.members.cache.get(user.id);
                    };
                    muted.roles.add(muteRole.id);
                    message.channel.send(`${muted.user} a été mute pendant 10 minutes`);
                    setTimeout(function() {
                        muted.roles.remove(muteRole.id);
                    }, 600000);
                }).catch(collected => {
                    throw "tu n'as pas répondu à temps";
                });
            }
        }
    ],
    execute(message, args) {
        const { shop } = this;
        message.channel.send({
            embed: {
                author: {
                    name: "Shop Unbelievaboat",
                    icon_url: `https://cdn.discordapp.com/avatars/${message.client.user.id}/${message.client.user.avatar}.png`
                },
                color: "#010101",
                fields: shop.map(item => {
                    return { "name": `• ${item.name} - ✨${item.price}`, "value": `*${item.description}*`, "inline": true }
                }),
                footer: {
                    text: "✨ Mayze ✨"
                }
            }
        });
    }
};