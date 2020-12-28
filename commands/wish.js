const { Message } = require("discord.js");

const command = {
	name: "wish",
	description: "Wish des séries pour Mudae",
	aliases: [],
	args: 1,
	usage: "<série>$[autres noms]",
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 */
	async execute(message, args) {
		const series = args.join(" ").split("$")[0].toLowerCase().replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase() });
		const altNames = (args.join(" ").split("$")[1] || "").toLowerCase();
		var query = `INSERT INTO wishes (user_id, series) VALUES ('${ message.author.id }', '${ series }')`;
		if (regex) query = `INSERT INTO wishes (user_id, series, regex) VALUES ('${ message.author.id }', '${ series }', '${ series.toLowerCase() }|${ altNames }')`
		try { await message.client.pg.query(query); }
		catch (err) {
			console.log(err);
			return message.channel.send("Quelque chose s'est mal passé en joignant la base de données :/").catch(console.error);
		}
		message.react("✅").catch(console.error);
	}
};

module.exports = command;