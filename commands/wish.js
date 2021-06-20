const { Message } = require("discord.js");

const command = {
	name: "wish",
	description: {
		fr: "Ajouter un wish pour une série pour Mudae",
		en: "Add a series to your Mudae wishes"
	},
	aliases: [],
	args: 1,
	usage: "\"<serie>\" [<regex>]",
	botPerms: ["ADD_REACTIONS"],
	slashOptions: [
		{
			name: "series",
			description: "The series to add to your wishes",
			type: 3,
			required: true
		},
		{
			name: "regex",
			description: "A regex to match alternative names as well",
			type: 3,
			required: false
		}
	],
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, language, languageCode) => {
		const series = args
			? args[0].toLowerCase().replace(/(?:^|\s)\S/g, a => a.toUpperCase())
			: options[0].value.toLowerCase().replace(/(?:^|\s)\S/g, a => a.toUpperCase());
		const regex = args
			? args.slice(1).join(" ").replace(series).trim().toLowerCase()
			: options[1] ? options[1].value : null;

		if (!message.guild.members.cache.has("432610292342587392")) return language.errors.mudae;

		let query = `INSERT INTO wishes (user_id, series) VALUES ('${message.author.id}', '${series.replace(/'/g, "''")}')`;
		if (regex) query = `INSERT INTO wishes (user_id, series, regex) VALUES ('${message.author.id}', '${series.replace(/'/g, "''")}', '${regex.replace(/'/g, "''")}')`;
		const res = await message.client.pg.query(query).catch(console.error);
		if (!res) return message.channel.send(language.errors.database).catch(console.error);
		if (!message.isInteraction) message.react("✅").catch(console.error);
		else message.reply(language.added, { ephemeral: true }).catch(console.error);
	}
};

module.exports = command;