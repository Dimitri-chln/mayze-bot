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
	onlyInGuilds: ["689164798264606784", "744291144946417755"],
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
			let channel = message.guild.channels.cache.find(c => c.topic === message.author.id && c.parentID === "843817674948476929");
				
			if (!channel) {
				channel = await message.guild.channels.create(message.author.username, "text").catch(console.error);
				await channel.setParent("843817674948476929").catch(console.error);
				channel.setTopic(message.author.id).catch(console.error);
				channel.createOverwrite(message.member, { "VIEW_CHANNEL": true }).catch(console.error);
			} else {
				channel.setName(message.author.username).catch(console.error);
			}
		}

		const guild = message.client.guilds.cache.get("689164798264606784");
		if (guild.members.cache.has(message.author.id)) {
			guild.members.cache.get(message.author.id).roles.add("845217535992791061").catch(console.error);
		}
		
		message.reply(language.joined).catch(console.error);
	}
};

module.exports = command;