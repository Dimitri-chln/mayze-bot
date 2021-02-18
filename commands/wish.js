const { Message } = require("discord.js");

const command = {
	name: "wish",
	description: "Ajouter un wish pour une série pour Mudae",
	aliases: [],
	args: 1,
	usage: "\"<série>\" [autres noms]",
	slashOptions: [
		{
			name: "série",
			description: "La série à wish",
			type: 3,
			required: true
		},
		{
			name: "regex",
			description: "Un regex pour reconnaître le nom de la série",
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
			? (args.join(" ").match(/"[^"]*"/)|| [""])[0].toLowerCase().replace(/(?:^|\s)\S/g, a => a.toUpperCase())
			: options[0].value.toLowerCase().replace(/(?:^|\s)\S/g, a => a.toUpperCase());
		const regex = args
			? args.join(" ").replace(series).trim().toLowerCase()
			: (options[1] || {}).value;
		if (!series) return message.reply("écris le nom de la série entre guillemets").catch(console.error);

		let query = `INSERT INTO wishes (user_id, series) VALUES ('${message.author.id}', '${series}')`;
		if (regex) query = `INSERT INTO wishes (user_id, series, regex) VALUES ('${message.author.id}', '${series}', '${regex}')`;
		const res = await message.client.pg.query(query).catch(console.error);
		if (!res) return message.channel.send("Quelque chose s'est mal passé en accédant à la base de données :/").catch(console.error);
		if (message.deletable) message.react("✅").catch(console.error);
		else message.reply("wish ajouté").catch(console.error);
	}
};

module.exports = command;