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
	cooldown: 10,
	onlyInGuilds: ["689164798264606784"],
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options, language, languageCode) => {
		const spinning = "<a:slots:845009613664288769>";
		const slots = ["🥊", "⛓️", "🔇", "🏓", "🔒"];
		const result = [];

		const msg = await message.channel.send({
			embed: {
				author: {
					name: language.title,
					icon_url: message.author.avatarURL()
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
					message.channel.send(`*kick ${message.author} ${language.kick_reason}`).then(m => {
						message.client.commands.get("kick").execute(m, [ message.author.toString(), language.kick_reason ]);
					}).catch(console.error);
					break;
				case "⛓️":
					message.channel.send(`*jail ${message.author}`).then(m => {
						message.client.commands.get("jail").execute(m, [ message.author.toString() ]);
					}).catch(console.error);
					break;
				case "🔇":
					let muteDuration = Math.ceil(Math.random() * 10);
					message.channel.send(`*mute ${message.author} ${muteDuration}m`).then(m => {
						message.client.commands.get("mute").execute(m, [ message.author.toString(), `${muteDuration}m` ]);
					}).catch(console.error);
					break;
				case "🏓":
					message.reply(language.massping).catch(console.error);
					const massPingFilter = m => m.author.id === message.author.id && m.mentions.users.size;
					const massPingCollected = await message.channel.awaitMessages(massPingFilter, { max: 1, time: 60000 }).catch(console.error);
					if (!massPingCollected) return message.channel.send(language.too_late).catch(console.error);
					message.channel.send(`*mass-ping ${massPingCollected.first().mentions.users.first()} 25`).then(m => {
						message.client.commands.get("mass-ping").execute(m, [ massPingCollected.first().mentions.users.first().toString(), "25" ]);
					}).catch(console.error);
					break;
				case "🔒":
					message.reply(language.mute).catch(console.error);
					const muteFilter = m => m.author.id === message.author.id && m.mentions.users.size;
					const muteCollected = await message.channel.awaitMessages(muteFilter, { max: 1, time: 60000 }).catch(console.error);
					if (!muteCollected) return message.channel.send(language.too_late).catch(console.error);
					message.channel.send(`*mute ${muteCollected.first().mentions.users.first()} 2m`).then(m => {
						message.client.commands.get("mute").execute(m, [ muteCollected.first().mentions.users.first().toString(), "2m" ]);
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