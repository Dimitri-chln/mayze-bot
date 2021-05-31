const { Message } = require("discord.js");

const command = {
	name: "wish-remove",
	description: {
		fr: "Retirer le wish d'une série pour Mudae",
		en: "Remove a series from your Mudae wishes"
	},
	aliases: ["wishremove", "wr"],
	args: 1,
	usage: "<series>",
	slashOptions: [
		{
			name: "series",
			description: "The series to remove",
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
		const series = args
			? args.join(" ").toLowerCase().replace(/(?:^|\s)\S/g, a => a.toUpperCase())
			: options[0].value.toLowerCase().replace(/(?:^|\s)\S/g, a => a.toUpperCase());

		if (!message.guild.members.cache.has("432610292342587392")) return language.errors.mudae;

		const res = await message.client.pg.query(`DELETE FROM wishes WHERE user_id='${message.author.id}' AND series='${series.replace(/'/g, "''")}'`).catch(console.error);
		if (!res) return message.reply(language.errors.database).catch(console.error);
		if (!message.isInteraction) message.react("✅").catch(console.error);
		else message.reply(language.removed, { ephemeral: true }).catch(console.error);
	}
};

module.exports = command;