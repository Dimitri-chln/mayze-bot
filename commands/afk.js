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
		
		const { rows } = (await message.client.pg.query(`SELECT * FROM afk WHERE user_id = '${message.author.id}'`).catch(console.error)) || {};
		if (!rows) return message.channel.send(language.errors.database, { ephemeral: true }).catch(console.error);

		if (rows.length) message.client.pg.query(`DELETE FROM afk WHERE user_id = '${message.author.id}'`).catch(console.error);
		if (AKFmessage) message.client.pg.query(`INSERT INTO afk (user_id, message) VALUES ('${message.author.id}', '${AKFmessage}')`).catch(console.error);
		else message.client.pg.query(`INSERT INTO afk (user_id) VALUES ('${message.author.id}')`).catch(console.error);

		message.channel.send(language.get(language.afk_message, message.author.toString(), AKFmessage ? `\n**→ ${AKFmessage}**` : ""), { disableMentions: "everyone", ephemeral: true }).catch(console.error);
	}
};

module.exports = command;