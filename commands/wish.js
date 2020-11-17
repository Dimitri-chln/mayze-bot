const command = {
	name: "wish",
	description: "Wish des séries pour Mudae",
	aliases: [],
	args: 1,
	usage: "<série>",
	async execute(message, args) {
		const databaseSQL = require("../modules/databaseSQL.js");
		const series = args.join(" ").toLowerCase().replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase() });
		try { await databaseSQL(`INSERT INTO wishes (user, series) VALUES ('${message.author.id}', '${series}')`); }
		catch (err) {
			console.log(err);
			try { message.channel.send("Quelque chose s'est mal passé en joignant la base de données :/"); }
			catch (err) { console.log(err); }
			return;
		}
		try { message.react("✅"); }
		catch (err) { console.log(err); }
	}
};

module.exports = command;