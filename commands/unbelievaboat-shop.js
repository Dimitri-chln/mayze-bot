const command = {
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
				try {
					const msg = await message.channel.send(`*jail ${message.author}`);
					jail.execute(msg, []);
				} catch (err) { console.log(err); throw err; }
			}
		},
		{
			name: "Mute à double tranchant",
			description: "Choisis une personne et une durée. Un de vous deux sera mute pendant cette durée (<1h)",
			price: 7500,
			async buy(message) {
				const filter = response => /<@!?\d{18}>/.test(response.content) && response.author.id === message.author.id;
				const msg = await message.reply("mentionne la personne que tu veux mute: → `<mention> <durée>`");
				try {
					const collected = await message.channel.awaitMessages(filter, {max: 1, time: 60000, errors: ["time"]});
					const r = Math.random();
					var muted = message.author;
					if (r < 0.5) muted = collected.first().mentions.users.first();
					const dhms = require("dhms");
					const mute = require ("./mute.js");
					var duration = collected.first().content.replace(/^<@!?\d{18}>/, "").trim();
					if (dhms(duration, true) <= 0 || dhms(duration, true) > 3600) {
						duration = "2m";
					};
					try {
						const msg = await message.channel.send(`*mute ${muted} ${duration}`)
						mute.execute(msg, [muted, duration]);
					} catch (err) { console.log(err); throw err; };
					try {
						msg.delete();
						collected.first().delete();
					} catch (err) { console.log(err); }
				} catch (err) {
					message.reply("tu n'as pas répondu à temps").catch(console.error);
				}
			}
		}
	],
	async execute(message, args) {
		const { shop } = this;
		try {
			message.channel.send({
				embed: {
					author: {
						name: "Shop Unbelievaboat",
						icon_url: message.client.user.avatarURL()
					},
					color: "#010101",
					fields: shop.map(item => { return { "name": `• ${item.name} - ✨${item.price}`, "value": `*${item.description}*`, "inline": true } }),
					footer: {
						text: "✨ Mayze ✨"
					}
				}
			});
		} catch (err) { console.log(err); }
	}
};

module.exports = command;