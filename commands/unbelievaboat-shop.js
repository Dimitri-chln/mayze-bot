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
            description: "Choisis une personne et une durée. Un de vous deux sera mute pendant cette durée (<1h)",
            price: 7500,
            async buy(message) {
                const muteRole = message.guild.roles.cache.get("695330946844721312");
                const user = message.mentions.users.first();
                const filter = function(response) {
                    return /<@!?\d{18}>/.test(response.content) && response.author.id === message.author.id;
                };
                const msg = await message.reply("mentionne la personne que tu veux mute: →`<mention> <durée>`");
                message.channel.awaitMessages(filter, {max: 1, time: 60000, errors: ["time"]})
                .then(collected => {
                    const r = Math.random() * 2;
                    var muted = message.author.id;
                    if (r < 1) {
                        muted = collected.first().mentions.users.first().id;
                    };
                    
                    const dhms = require("dhms");
                    const mute = require ("./mute.js");
                    var duration = collected.first().content.trim().slice(22);
                    if (dhms(duration, true) <= 0 || dhms(duration, true) > 3600) {
                        duration = "2m";
                    };
                    message.channel.send(`*mute <@${muted}> ${duration}`).then(m => {
                        mute.execute(m, [muted, duration]);
                    });
                    
                    msg.delete();
                    collected.first().delete();
                }).catch(err => {
                    console.log(err);
                    message.reply("tu n'as pas répondu à temps");
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