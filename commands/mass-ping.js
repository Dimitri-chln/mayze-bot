const { Message } = require("discord.js");

const command = {
	name: "mass-ping",
	description: "Ping une personne en boucle",
	aliases: ["massping"],
	args: 1,
	usage: "<mention> [nombre]",
	perms: ["MANAGE_MESSAGES"],
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 */
	async execute(message, args) {
		const { Collection } = require("discord.js");
		const messages = new Collection();
		const user = message.mentions.users.first();
		const n = parseInt(args[1], 10) || 10;
		message.delete().catch(console.error);
		if (isNaN(n) || n < 0 || n > 100) return message.reply("le nombre doit être compris entre 0 et 100").catch(console.error);
		
		for (i = 0; i < n; i++) {
			const msg = await message.channel.send(`${user}`).catch(console.error);
			messages.set(msg.id, msg);
		}

		message.channel.bulkDelete(messages).catch(console.error);
	}
};

module.exports = command;