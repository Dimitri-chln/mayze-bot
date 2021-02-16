const { Message } = require("discord.js");

const command = {
	name: "afk",
	description: "Se mettre AFK",
	aliases: [],
	args: 0,
	usage: "[message]",
	slashOptions: [
		{
			name: "message",
			description: "Le message à afficher lorsqu'on te mentionne",
			type: 3,
			required: false
		}
	],
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, languages, language) => {
		const AKFmessage = args
			? args.join(" ").replace(/^./, a => a.toUpperCase())
			: (options ? options[0].value : "").replace(/^./, a => a.toUpperCase());
		const { rows } = await message.client.pg.query(`SELECT * FROM afk WHERE user_id = '${message.author.id}'`).catch(console.error);
		if (rows.length) message.client.pg.query(`DELETE FROM afk WHERE user_id = '${message.author.id}'`).catch(console.error);
		if (AKFmessage) message.client.pg.query(`INSERT INTO afk (user_id, message) VALUES ('${message.author.id}', '${AKFmessage}')`).catch(console.error);
		else message.client.pg.query(`INSERT INTO afk (user_id) VALUES ('${message.author.id}')`).catch(console.error);

		message.channel.send(languages.get(languages.data.afk.afk_message[language], message.author.toString(), AKFmessage ? `\n**→ ${AKFmessage}**` : "")).catch(console.error);
	}
};

module.exports = command;