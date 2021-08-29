const { Message } = require("discord.js");

const command = {
	name: "wish-remove",
	description: {
		fr: "Retirer le wish d'une série pour Mudae",
		en: "Remove a series from your Mudae wishes"
	},
	aliases: ["wishremove", "wr"],
	args: 1,
	usage: "<#series>",
	botPerms: ["ADD_REACTIONS"],
	category: "games",
	slashOptions: [
		{
			name: "series",
			description: "The number of the series to remove",
			type: 3,
			required: true
		}
	],
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options, language, languageCode) => {
		const seriesID = args
			? parseInt(args[0])
			: parseInt(options[0].value);
		
		if (!message.guild.members.cache.has("432610292342587392")) return language.errors.mudae;

		const { "rows": wishlist } = (await message.client.pg.query(`SELECT * FROM wishes WHERE user_id = '${message.author.id}' ORDER BY id`).catch(console.error)) || {};
		if (!wishlist) return message.channel.send(language.errors.database).catch(console.error);

		const res = await message.client.pg.query(
			"DELETE FROM wishes WHERE id = $1",
			[ wishlist[seriesID - 1].id ]
		).catch(console.error);
		if (!res) return message.reply(language.errors.database).catch(console.error);
		
		if (!message.isInteraction) message.react("✅").catch(console.error);
		else message.reply(language.removed).catch(console.error);
	}
};

module.exports = command;