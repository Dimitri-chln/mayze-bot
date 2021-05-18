const { Message } = require("discord.js");

const command = {
	name: "event",
	description: {
		fr: "Une commmande utilisable uniquement lors d'events",
		en: "A command only usable during events"
	},
	aliases: [],
	args: 0,
	usage: "",
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, language, languageCode) => {
		const Canvas = require("../utils/canvas/Canvas");

		const { rows } = (await message.client.pg.query(`SELECT * FROM boards WHERE user_id = '${message.author.id}'`).catch(console.error)) || {};
		if (!rows) return message.channel.send(language.errors.database).catch(console.error);

		if (!rows.length) {
			const res = await message.client.pg.query(`INSERT INTO boards VALUES ('${message.author.id}', 'event-${message.author.id}')`).catch(console.error);
			if (!res) return message.channel.send(language.errors.database).catch(console.error);
		} else if (rows[0].board !== `event-${message.author.id}`) {
			const res = await message.client.pg.query(`UPDATE boards SET board = 'event-${message.author.id}' WHERE user_id = '${message.author.id}'`).catch(console.error);
			if (!res) return message.channel.send(language.errors.database).catch(console.error);
		} else {
			return message.reply(language.joined).catch(console.error);
		}

		const canvas = new Canvas(`event-${message.author.id}`, message.client, message.client.palettes, 32);
		message.client.boards.set(`event-${message.author.id}`, canvas);

		if (message.guild.id === "744291144946417755") {
			let channel = message.guild.channels.cache.find(c => c.topic === member.id && c.parentID === "843817674948476929");
				
			if (!channel) {
				channel = await member.guild.channels.create(member.user.username, "text").catch(console.error);
				await channel.setParent("843817674948476929").catch(console.error);
				channel.setTopic(member.id).catch(console.error);
				channel.createOverwrite(member, { "VIEW_CHANNEL": true }).catch(console.error);
			} else {
				channel.setName(member.user.username).catch(console.error);
			}
		}
		
		message.reply(language.joined).catch(console.error);
	}
};

module.exports = command;