const { Message } = require("discord.js");

const command = {
	name: "slots",
	description: {
		fr: "Joue à une partie de casino",
		en: "Play a slots game",
	},
	aliases: [],
	args: 0,
	usage: "",
	botPerms: ["EMBED_LINKS", "MANAGE_ROLES", "KICK_MEMBERS"],
	cooldown: 10,
	onlyInGuilds: ["689164798264606784"],
	category: "miscellaneous",
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	run: async (message, args, options, language, languageCode) => {
		const spinning = "<a:slots:845009613664288769>";
		const slots = ["🥊", "⛓️", "🔇", "🏓", "🔒"];
		const result = [];

		const msg = await message.channel.send({
			embed: {
				author: {
					name: language.title,
					iconURL: message.author.displayAvatarURL()
				},
				color: message.guild.me.displayColor,
				description: spinning + spinning + spinning,
				footer: {
					text: "✨ Mayze ✨"
				}
			}
		}).catch(console.error);

		setTimeout(() => {
			msg.edit(msg.embeds[0].setDescription(randomSlot() + spinning + spinning)).catch(console.error);
			setTimeout(() => {
				msg.edit(msg.embeds[0].setDescription(result[0] + randomSlot() + spinning)).catch(console.error);
				setTimeout(() => {
					msg.edit(msg.embeds[0].setDescription(result[0] + result[1] + randomSlot())).catch(console.error);
					setTimeout(endSlots, 2000);
				}, 2000);
			}, 2000);
		}, 2000);


		async function endSlots() {
			if (result[0] !== result[1] || result[1] !== result[2]) return;

			switch (result[0]) {
				case "🥊":
					message.author.send(language.kick).catch(console.error);
					message.channel.send(`*kick ${message.author} ${language.kick_reason}`).then(m => {
						message.client.commands.get("kick").run(m, [ message.author.toString(), language.kick_reason ]);
					}).catch(console.error);
					break;
				case "⛓️":
					if (message.channel.id === "695934227140837386") {
						message.reply(language.jail_in_jail).catch(console.error);
					} else {
						message.channel.send(`*jail ${message.author}`).then(m => {
							message.client.commands.get("jail").run(m, [ message.author.toString() ]);
						}).catch(console.error);
					}
					break;
				case "🔇":
					let muteDuration = Math.ceil(Math.random() * 10);
					message.channel.send(`*mute ${message.author} ${muteDuration}m`).then(m => {
						message.client.commands.get("mute").run(m, [ message.author.toString(), `${muteDuration}m` ]);
					}).catch(console.error);
					break;
				case "🏓":
					message.reply(language.massping).catch(console.error);
					const massPingFilter = m => m.author.id === message.author.id && m.mentions.users.size;
					const massPingCollected = await message.channel.awaitMessages(massPingFilter, { max: 1, time: 60000 }).catch(console.error);
					if (!massPingCollected || !massPingCollected.size) return message.channel.send(language.too_late).catch(console.error);
					message.channel.send(`*mass-ping ${massPingCollected.first().mentions.users.first()} 25`).then(m => {
						message.client.commands.get("mass-ping").run(m, [ massPingCollected.first().mentions.users.first().toString(), "25" ]);
					}).catch(console.error);
					break;
				case "🔒":
					message.reply(language.mute).catch(console.error);
					const muteFilter = m => m.author.id === message.author.id && m.mentions.users.size;
					const muteCollected = await message.channel.awaitMessages(muteFilter, { max: 1, time: 60000 }).catch(console.error);
					if (!muteCollected || !muteCollected.size) return message.channel.send(language.too_late).catch(console.error);
					message.channel.send(`*mute ${muteCollected.first().mentions.users.first()} 2m`).then(m => {
						message.client.commands.get("mute").run(m, [ muteCollected.first().mentions.users.first().toString(), "2m" ]);
					}).catch(console.error);
					break;
			}
		}

		function randomSlot() {
			const random = slots[Math.floor(Math.random() * slots.length)];
			slots.push(random);
			result.push(random);
			return random;
		}
	}
};

module.exports = command;