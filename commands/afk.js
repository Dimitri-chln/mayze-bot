const { Message } = require("discord.js");

const command = {
	name: "afk",
	description: {
		fr: "Ajouter un statut AFK",
		en: "Set AFK status"
	},
	aliases: [],
	args: 0,
	usage: "[<message>]",
	category: "miscellaneous",
	slashOptions: [
		{
			name: "message",
			description: "The message to send when you are mentionned",
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
		const AKFmessage = args
			? args.join(" ").replace(/^./, a => a.toUpperCase())
			: options ? options[0].value.replace(/^./, a => a.toUpperCase()) : "";
		
		const res = await message.client.pg.query(
			`
			INSERT INTO afk VALUES ($1, $2)
			ON CONFLICT (user_id)
			DO UPDATE SET message = $2
			WHERE afk.user_id = EXLUDED.user_id
			`,
			[ message.author.id, AKFmessage ]
		).catch(console.error);

		if (!res) return message.channel.send(language.errors.database, { ephemeral: true }).catch(console.error);

		message.channel.send(language.get(language.afk_message, message.author.toString(), AKFmessage ? `\n**→ ${AKFmessage}**` : ""), { disableMentions: "everyone", ephemeral: true }).catch(console.error);
	}
};

module.exports = command;