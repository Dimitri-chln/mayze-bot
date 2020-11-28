const command = {
	name: "sql",
	description: "Effectue une requête SQL sur la base de données PostgreSQL",
	aliases: ["postgresql", "pg", "psql"],
	args: 1,
	usage: "<query>",
	ownerOnly: true,
	async execute(message, args) {
		try {
			const res = await message.client.pgClient.query(args.join(" "));
			switch (res.command) {
				case "SELECT":
					const charactersPerPage = 2000;
					const resString = JSON.stringify(res.rows, null, 4);
					if (resString.length < charactersPerPage) {
						message.channel.send({
							embed: {
								author: {
									name: args.join(" "),
									icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
								},
								color: "#010101",
								description: `\`\`\`js\n${resString}\n\`\`\``,
								footer: {
									text: "✨Mayze✨"
								}
							}
						}).catch(console.error);
					} else {
						const paginationEmbed = require("discord.js-pagination");
						const { MessageEmbed } = require("discord.js");
						var pages = [];
						for (i = 0; i < Math.ceil(resString.length / charactersPerPage); i += charactersPerPage) {
							const embed = new MessageEmbed()
								.setAuthor(args.join(" "), `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`)
								.setDescription(`\`\`\`js\n${resString.slice(i, i + charactersPerPage)}\n\`\`\``)
								.setFooter("✨Mayze✨")
							pages.push(embed);
						}
						paginationEmbed(message, pages).catch(console.error);
					}
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