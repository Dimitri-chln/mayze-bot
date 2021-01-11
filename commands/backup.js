const { Message } = require("discord.js");

const command = {
	name: "backup",
	description: "Sauvegarde toutes les données en cas de perte",
	aliases: [],
	args: 2,
	usage: "start <table> | get <table>",
	ownerOnly: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 */
	async execute(message, args) {
		if (process.env.HOST === "HEROKU") return message.reply("Cette commande ne fonctionne pas sur Heroku").catch(console.error);
		const fs = require("fs");
		const { MessageAttachment } = require("discord.js");
		const table = args[1];
		
		switch (args[0].toLowerCase()) {
			case "start":
				const msg = await message.channel.send("Récupération des données...").catch(console.error);
				const { rows } = await message.client.pg.query(`SELECT * FROM ${table}`).catch(console.error);
				if (!rows) return message.reply("Quelque chose s'est mal passé en accédant à la base de données :/").catch(console.error);
				fs.writeFile(`backups/database_${table}.json`, JSON.stringify(rows, null, 4), "utf8", () => {
					console.log("Backup complete");
					msg.edit("Backup terminée !").catch(console.error);
				});
				break;
			case "get":
				message.channel.startTyping();
				fs.readFile(`backups/database_${table}.json`, async (err, buffer) => {
					if (err) {
						console.error(err);
						if (err.code === "ENOENT") message.reply("Il n'y a pas de backup correspondant à cette table").catch(console.error);
						return;
					}
					const file = new MessageAttachment(buffer, `${table}.json`);
					message.channel.send({ files: [file] }).catch(console.error);
					message.channel.stopTyping();
				});
				break;
			default:
				message.reply("arguments incorrect").catch(console.error);
		}
	}
}

module.exports = command;