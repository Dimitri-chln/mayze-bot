const { Collection } = require("discord.js");

const data = [
    {
        name: "Visite de prison",
        description: "Acheter un billet te permettant de passer tes vacances au goulag",
        price: 10000,
        async buy(message) {
            const jail = message.client.commands.get("jail");
            const msg = await message.channel.send(`*jail ${message.author}`).catch(console.error);
            jail.run(msg, []).catch(err => {
                console.error(err);
                throw err
            });
        }
    },
    {
        name: "Mute à double tranchant",
        description: "Choisis une personne et une durée. Un de vous deux sera mute pendant cette durée (< 1h)",
        price: 7500,
        async buy(message) {
            const filter = response => response.mentions.users.size && response.author.id === message.author.id;
            const msg = await message.reply("mentionne la personne que tu veux mute: → `<mention> <durée>`");
            const collected = await message.channel.awaitMessages(filter, { max: 1, time: 30000 });
            if (!collected.size) return message.reply("tu n'as pas répondu à temps").catch(console.error);
            const r = Math.random();
            let muted = message.author;
            if (r < 0.5) muted = collected.first().mentions.users.first();
            const dhms = require("dhms");
            const mute = message.client.commands.get("mute");
            let duration = collected.first().content.replace(/<@!?\d{18}>/, "").trim();
            if (dhms(duration) <= 0 || dhms(duration) > 3600000) duration = "2m";
            const muteMsg = await message.channel.send(`*mute ${muted} ${duration}`).catch(console.error);
            if (muteMsg) mute.run(muteMsg, [muted, duration]).catch(err => {
                console.error(err);
                throw err;
            });
            msg.delete().catch(console.error);
            collected.first().delete().catch(console.error);
        }
    }
];

const shop = new Collection(data.map(d => [ d.name, d ]));

module.exports = shop;