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
	botPerms: ["ADD_REACTIONS"],
	category: "utility",
	options: [
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
	run: async (message, args, options, language, languageCode) => {
		const availableLanguages = ["fr", "en"];

		const currentLanguage = (await message.client.database.query(`SELECT * FROM languages WHERE guild_id = '${message.guild.id}'`)).rows[0];

		const newLanguage = args
			? args[0].toLowerCase()
			: options[0].value;
		if (!availableLanguages.includes(newLanguage)) return message.reply(language.get(language.invalid_language, availableLanguages.join("`, `"))).catch(console.error);

		if (currentLanguage) var res = await message.client.database.query(`UPDATE languages SET language_code = '${newLanguage}' WHERE guild_id = '${message.guild.id}'`).catch(console.error);
		else var res = await message.client.database.query(`INSERT INTO languages VALUES ('${message.guild.id}', '${newLanguage}')`).catch(console.error);
		if (!res) return message.channel.send(language.errors.database).catch(console.error);

		message.client.languages.set(message.guild.id, newLanguage);
		
		if (!message.isInteraction) message.react("✅").catch(console.error);
		else message.reply(language.language_updated).catch(console.error);
	}
};

module.exports = command;