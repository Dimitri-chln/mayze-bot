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
		
		message.reply(language.joined).catch(console.error);
	}
};

module.exports = command;