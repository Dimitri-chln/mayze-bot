const command = {
	name: "sql",
	description: "Effectuer une requête SQL sur la base de données PostgreSQL",
	aliases: ["postgresql", "pg", "psql"],
	args: 1,
	usage: "<query>",
	ownerOnly: true,
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	async execute(message, args, options) {
		const command = args
			? args.join(" ")
			: options[0].value;
		const res = await message.client.pg.query(command).catch(console.error);
		if (!res) return message.channel.send("Quelque chose s'est mal passé en exécutant la commande :/").catch(console.error);
		switch (res.command) {
			case "SELECT":
				const charactersPerPage = 2000;
				const resString = JSON.stringify(res.rows, null, 4);
				if (resString.length < charactersPerPage) {
					message.channel.send({
						embed: {
							author: {
								name: command,
								icon_url: message.author.avatarURL({ dynamic: true })
							},
							color: "#010101",
							description: `\`\`\`json\n${resString}\n\`\`\``,
							footer: {
								text: "✨Mayze✨"
							}
						}
					}).catch(console.error);
				} else {
					const pagination = require("../modules/pagination.js");
					const { MessageEmbed } = require("discord.js");
					const regex = /\[?\s*\{\n(.|\n){0,2000}\},?\n\]?/yg;
					const matches = resString.match(regex);
					let pages = [];
					for (i = 0; i < matches.length; i++) {;
						let embed = new MessageEmbed()
							.setColor("#010101")
							.setTitle(`Le résultat contient ${res.rowCount} lignes`)
							.setAuthor(command, message.author.avatarURL({ dynamic: true }))
							.setDescription(`\`\`\`json\n${matches[i]}\n\`\`\``);
						pages.push(embed);
					}
					pagination(message, pages).catch(console.error);
				}
				break;
			case "INSERT":
				message.channel.send(`Le tableau contient désormais ${res.rowCount} lignes`).catch(console.error);
				break;
			default:
				message.channel.send("Requête effectuée").catch(console.error);
		}
	}
};

module.exports = command;