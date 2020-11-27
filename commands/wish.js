const command = {
	name: "wish",
	description: "Wish des séries pour Mudae",
	aliases: [],
	args: 1,
	usage: "<série>$[regex]",
	async execute(message, args) {
		const databaseSQL = require("../modules/databaseSQL.js");
		const series = args.join(" ").split("$")[0].toLowerCase().replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase() });
		const regex = (args.join(" ").split("$")[1] || "").toLowerCase();
		var query = `INSERT INTO wishes (user_id, series) VALUES ('${message.author.id}', '${series}')`;
		if (regex) query = `INSERT INTO wishes (user_id, series, regex) VALUES ('${message.author.id}', '${series}', '${series.toLowerCase()}|${regex}')`
		try { await databaseSQL(query); }
		catch (err) {
			console.log(err);
			return message.channel.send("Quelque chose s'est mal passé en joignant la base de données :/").catch(console.error);
		}
		message.react("✅").catch(console.error);
	}
};

module.exports = command;