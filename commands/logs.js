const { Message } = require("discord.js");

const command = {
	name: "logs",
	description: "Regarde les logs récent du bot",
	aliases: [],
	args: 0,
	usage: "",
	ownerOnly: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 */
	async execute(message, args) {
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
					description: `\`\`\`\n${resString}\n\`\`\``,
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