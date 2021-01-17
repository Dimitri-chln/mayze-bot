const { Message } = require("discord.js");

const command = {
	name: "logs",
	description: "Obtenir les logs récent du bot",
	aliases: [],
	args: 0,
	usage: "",
	ownerOnly: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options) => {
		if (process.env.HOST === "HEROKU") return message.reply("cette commande ne fonctionne pas sur Heroku").catch(console.error);
		const shellExec = require("../modules/shellExec.js");
		const output = shellExec("heroku logs --app mayze-bot");
		const charactersPerPage = 2000;
		if (output.length < charactersPerPage) {
			message.channel.send({
				embed: {
					author: {
						name: "Logs Heroku",
						icon_url: message.author.avatarURL({ dynamic: true })
					},
					color: "#010101",
					description: `\`\`\`\n${output}\n\`\`\``,
					footer: {
						text: "✨Mayze✨"
					}
				}
			}).catch(console.error);
		} else {
			const pagination = require("../modules/pagination.js");
			const { MessageEmbed } = require("discord.js");
			const regex = /(.|\n){0,2000}\n/yg;
			const matches = output.match(regex);
			let pages = [];
			for (i = 0; i < matches.length; i++) {;
				let embed = new MessageEmbed()
					.setColor("#010101")
					.setAuthor("Logs Heroku", message.author.avatarURL({ dynamic: true }))
					.setDescription(`\`\`\`\n${matches[i]}\n\`\`\``);
				pages.push(embed);
			}
			pagination(message, pages).catch(console.error);
		}
	}
};

module.exports = command;