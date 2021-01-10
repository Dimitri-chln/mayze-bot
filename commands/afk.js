const { Message } = require("discord.js");

const command = {
	name: "afk",
	description: "Te mets AFK pour prévenir les autres membres",
	aliases: [],
	args: 0,
	usage: "[message]",
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 */
	async execute(message, args) {
		const AKFmessage = args.join(" ").replace(/^./, a => a.toUpperCase());
		const { rows } = await message.client.pg.query(`SELECT * FROM afk WHERE user_id = '${message.author.id}'`).catch(console.error);
		if (rows.length) message.client.pg.query(`DELETE FROM afk WHERE user_id = '${message.author.id}'`).catch(console.error);
		if (AKFmessage) message.client.pg.query(`INSERT INTO afk (user_id, message) VALUES ('${message.author.id}', '${AKFmessage}')`).catch(console.error);
		else message.client.pg.query(`INSERT INTO afk (user_id) VALUES ('${message.author.id}')`).catch(console.error);

		message.channel.send(`${message.author} est maintenant AFK 💤\n${AKFmessage ? `**→ ${AKFmessage}**` : ""}`).catch(console.error);
	}
};

module.exports = command;