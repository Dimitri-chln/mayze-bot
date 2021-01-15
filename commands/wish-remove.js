const { Message } = require("discord.js");

const command = {
	name: "wish-remove",
	description: "Retire le wish d'une série pour Mudae",
	aliases: ["wr"],
	args: 1,
	usage: "<série>",
	slashOptions: [
		{
			name: "série",
			description: "La série à retirer de tes wish",
			type: 3,
			required: true
		}
	],
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	async execute(message, args, options) {
		const series = args
			? args.join(" ").toLowerCase().replace(/(?:^|\s)\S/g, a => a.toUpperCase())
			: options[0].value.toLowerCase().replace(/(?:^|\s)\S/g, a => a.toUpperCase());
		const res = await message.client.pg.query(`DELETE FROM wishes WHERE user_id='${message.author.id}' AND series='${series}'`).catch(console.error);
		if (!res) return message.reply("Quelque chose s'est mal passé en accédant à la base de données").catch(console.error);
		if (message.deletable) message.react("✅").catch(console.error);
		else message.reply("wish retiré").catch(console.error);
	}
};

module.exports = command;