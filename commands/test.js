const { Message } = require("discord.js");

const command = {
	name: "test",
	description: "testest",
	aliases: [],
	args: 0,
	usage: "",
	ownerOnly: true,
	/**
	 * 
	 * @param {Message} message 
	 * @param {string[]} args 
	 */
	async execute(message, args) {
		const fs = require("fs");
		const { rows } = await message.client.pg.query("SELECT * FROM pokemons").catch(console.error);
		fs.writeFile("backups/database_1.json", JSON.stringify(rows, null, 4), "utf8", () => console.log("Backup complete"));
	}
};

module.exports = command;