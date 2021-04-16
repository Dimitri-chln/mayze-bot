const { Message } = require("discord.js");

const command = {
	name: "logs",
	description: {
		fr: "Obtenir les logs récent du bot",
		en: "Get recent logs from the bot"
	},
	aliases: [],
	args: 0,
	usage: "",
	ownerOnly: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, language, languageCode) => {
		if (process.env.HOST === "HEROKU") return message.reply(language.errors.heroku).catch(console.error);

		const shellExec = require("../utils/shellExec");
		const output = shellExec("heroku logs --app mayze-bot");
		const charactersPerPage = 2000;
		if (output.length < charactersPerPage) {
			message.channel.send({
				embed: {
					author: {
						name: "Heroku Logs",
						icon_url: message.author.avatarURL({ dynamic: true })
					},
					color: message.guild.me.displayColor,
					description: `\`\`\`\n${output}\n\`\`\``,
					footer: {
						text: "✨ Mayze ✨"
					}
				}
			}).catch(console.error);
		} else {
			const pagination = require("../utils/pagination");
			const { MessageEmbed } = require("discord.js");
			const regex = /(.|\n){0,2000}\n/yg;
			const matches = output.match(regex);
			let pages = [];
			for (i = 0; i < matches.length; i++) {;
				let embed = new MessageEmbed()
					.setColor(message.guild.me.displayColor)
					.setAuthor("Heroku Logs", message.author.avatarURL({ dynamic: true }))
					.setDescription(`\`\`\`\n${matches[i]}\n\`\`\``);
				pages.push(embed);
			}
			pagination(message, pages).catch(err => {
				console.error(err);
				message.channel.send(language.errors.paginator).catch(console.error);
			});
		}
	}
};

module.exports = command;