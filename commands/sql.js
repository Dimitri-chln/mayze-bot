const command = {
	name: "sql",
	description: "Effectue une requête SQL sur la base de données PostgreSQL",
	aliases: ["postgresql", "pg", "psql"],
	args: 1,
	usage: "<query>",
	ownerOnly: true,
	async execute(message, args) {
		const databaseSQL = require("../modules/databaseSQL.js");
		try {
			const res = await databaseSQL(args.join(" "));
			switch (res.command) {
				case "SELECT":
					message.channel.send(`\`\`\`js\n${JSON.stringify(res.rows, null, 4)}\n\`\`\``).catch(console.error);
					break;
				case "INSERT":
					message.channel.send(`Le tableau contient désormais ${res.rowCount} lignes`).catch(console.error);
					break;
				default:
					message.channel.send("Requête effectuée").catch(console.error);
			}
		} catch (err) {
			console.log(err);
			message.channel.send(`Error:\n\`\`\`${err.name}\n\`\`\``).catch(console.error);
		}
	}
};

module.exports = command;