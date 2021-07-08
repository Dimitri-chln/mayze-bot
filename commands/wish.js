const { Message } = require("discord.js");

const command = {
	name: "wish",
	description: {
		fr: "Ajouter un wish pour une série pour Mudae",
		en: "Add a series to your Mudae wishes"
	},
	aliases: ["wosh"],
	args: 1,
	usage: "<series> [-r <regex>]",
	botPerms: ["ADD_REACTIONS"],
	category: "games",
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
			? (args.includes("-r") ? args.slice(0, args.indexOf("-r")) : args).join(" ").toLowerCase().replace(/(?:^|\s)\S/g, a => a.toUpperCase())
			: options[0].value.toLowerCase().replace(/(?:^|\s)\S/g, a => a.toUpperCase());
		const regex = args
			? args.includes("-r") ? args.slice(args.indexOf("-r") + 1).join(" ").trim().toLowerCase() : null
			: options[1] ? options[1].value : null;

		if (!message.guild.members.cache.has("432610292342587392")) return language.errors.mudae;
		if (!series) return message.reply(language.invalid_series).catch(console.error);

		let query = `INSERT INTO wishes (user_id, series) VALUES ('${message.author.id}', '${series.replace(/'/g, "''")}')`;
		if (regex) query = `INSERT INTO wishes (user_id, series, regex) VALUES ('${message.author.id}', '${series.replace(/'/g, "''")}', '${regex.replace(/'/g, "''")}')`;
		const res = await message.client.pg.query(query).catch(console.error);
		if (!res) return message.channel.send(language.errors.database).catch(console.error);
		if (!message.isInteraction) message.react("✅").catch(console.error);
		else message.reply(language.added, { ephemeral: true }).catch(console.error);
	}
};

module.exports = command;