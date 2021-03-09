const { Message } = require("discord.js");

const command = {
	name: "backup",
	description: {
		fr: "Sauvegarder des données en cas de perte",
		en: "Save data locally in case of a loss"
	},
	aliases: [],
	args: 2,
	usage: "start <table> | get <table>",
	ownerOnly: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, language, languageCode) => {
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
				const msg = await message.channel.send(language.fetching_data).catch(console.error);
				const { rows } = (await message.client.pg.query(`SELECT * FROM ${table}`).catch(console.error)) || {};
				if (!rows) return message.channel.send(language.errors.database).catch(console.error);
				Fs.writeFile(`backups/database_${table}.json`, JSON.stringify(rows, null, 4), "utf8", () => {
					console.log("Backup complete");
					msg.edit(language.complete).catch(console.error);
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
						if (err.code === "ENOENT") message.channel.send(language.invalid_table).catch(console.error);
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
				message.channel.send(language.errors.invalid_args).catch(console.error);
		}
	}
}

module.exports = command;