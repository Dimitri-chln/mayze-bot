const { Message } = require("discord.js");

const command = {
	name: "language",
	description: {
		fr: "Modifier la langue du bot sur le serverur",
		en: "Change the server's bot language"
	},
	aliases: ["lang"],
	args: 1,
	usage: "fr | en",
	perms: ["ADMINISTRATOR"],
	slashOptions: [
		{
			name: "language",
			description: "The new language",
			type: 3,
			required: true,
			choices: [
				{
					name: "Français",
					value: "fr",
				},
				{
					name: "English",
					value: "en"
				}
			]
		}
	],
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options, language) => {
		const availableLanguages = ["fr", "en"];

		const currentLanguage = (await message.client.pg.query(`SELECT * FROM languages WHERE guild_id = '${message.guild.id}'`)).rows[0];

		const newLanguage = args
			? args[0].toLowerCase()
			: options[0].value;
		if (!availableLanguages.includes(language)) return message.reply(language.get(language.invalid_language, availableLanguages.join(", "))).catch(console.error);

		if (currentLanguage) var res = await message.client.pg.query(`UPDATE languages SET language_code = '${newLanguage}' WHERE guild_id = '${message.guild.id}'`).catch(console.error);
		else var res = await message.client.pg.query(`INSERT INTO languages VALUES ('${message.guild.id}', '${newLanguage}')`).catch(console.error);
		if (!res) return message.channel.send(language.error_database).catch(console.error);

		language = newLanguage;
		
		if (message.deletable) message.react("✅").catch(console.error);
		else message.reply(language.language_updated).catch(console.error);
	}
};

module.exports = command;