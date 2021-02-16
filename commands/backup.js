const { Message } = require("discord.js");

const command = {
	name: "backup",
	description: "Sauvegarder des données en cas de perte",
	aliases: [],
	args: 2,
	usage: "start <table> | get <table>",
	ownerOnly: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, languages, language) => {
		if (process.env.HOST === "HEROKU") return message.reply("cette commande ne fonctionne pas sur Heroku").catch(console.error);
		const Fs = require("fs");
		const { MessageAttachment } = require("discord.js");
		const subCommand = args
			? args[0].toLowerCase()
			: options[0].name;
		
		switch (subCommand) {
			case "start": {
				const table = args
					? args[1]
					: options[0].options[0].value;
				const msg = await message.channel.send("Récupération des données...").catch(console.error);
				const { rows } = await message.client.pg.query(`SELECT * FROM ${table}`).catch(console.error);
				if (!rows) return message.channel.send("Quelque chose s'est mal passé en accédant à la base de données :/").catch(console.error);
				Fs.writeFile(`backups/database_${table}.json`, JSON.stringify(rows, null, 4), "utf8", () => {
					console.log("Backup complete");
					msg.edit("Backup terminée !").catch(console.error);
				});
				break;
			}
			case "get": {
				const table = args
					? args[1]
					: options[0].options[0].value;
				
				message.channel.startTyping(1);
				Fs.readFile(`backups/database_${table}.json`, async (err, buffer) => {
					if (err) {
						if (err.code === "ENOENT") message.channel.send("Il n'y a pas de backup correspondant à cette table").catch(console.error);
						else console.error(err);
						return;
					}
					const file = new MessageAttachment(buffer, `${table}.json`);
					message.channel.send({ files: [ file ] }).catch(console.error);
				});
				message.channel.stopTyping();
				break;
			}
			default:
				message.channel.send(`Utilisation : \`${message.client.prefix}backup start <table> | get <table>\``).catch(console.error);
		}
	}
}

module.exports = command;