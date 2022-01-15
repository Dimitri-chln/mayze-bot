const command = {
	name: "sql",
	description: "Effectuer une requête SQL sur la base de données PostgreSQL",
	aliases: ["postgresql", "pg", "psql"],
	args: 1,
	usage: "<query>",
	botPerms: ["EMBED_LINKS", "ADD_REACTIONS", "MANAGE_MESSAGES"],
	ownerOnly: true,
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	run: async (message, args, options, language, languageCode) => {
		const command = args
			? args.join(" ")
			: options[0].value;
		const res = await message.client.database.query(command).catch(console.error);
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
								iconURL: message.author.displayAvatarURL({ dynamic: true })
							},
							color: message.guild.me.displayColor,
							description: `\`\`\`json\n${resString}\n\`\`\``,
							footer: {
								text: "✨ Mayze ✨"
							}
						}
					}).catch(console.error);
				} else {
					const pagination = require("../utils/pagination");
					const { MessageEmbed } = require("discord.js");
					const regex = /\[?\s*\{\n.{0,2000}\},?\n\]?/ygs;
					const fallbackRegex = /.{0,2000}/ygs;
					const matches = resString.match(regex) || resString.match(fallbackRegex);
					let pages = [];
					for (i = 0; i < matches.length; i++) {
						let embed = new MessageEmbed()
							.setColor(message.guild.me.displayColor)
							.setTitle(`Le résultat contient ${res.rowCount} lignes`)
							.setAuthor(command, message.author.displayAvatarURL({ dynamic: true }))
							.setDescription(`\`\`\`json\n${matches[i]}\n\`\`\``);
						pages.push(embed);
					}
					pagination(message, pages).catch(err => {
						console.error(err);
						message.channel.send(language.errors.paginator).catch(console.error);
					});
				}
				break;
			default:
				message.channel.send("Requête effectuée").catch(console.error);
		}
	}
};

module.exports = command;