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
	botPerms: ["EMBED_LINKS", "ADD_REACTIONS", "MANAGE_MESSAGES"],
	ownerOnly: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, language, languageCode) => {
		if (process.env.HOST === "HEROKU") return message.reply(language.errors.heroku).catch(console.error);

		const shellExec = require("../utils/shellExec");
		
		let output;
		try {
			output = shellExec("heroku logs --app mayze-bot --num 1500");
		} catch (err1) {
			console.error(err1);
			try {
				output = shellExec("heroku logs --app mayze-bot2 --num 1500");
			} catch (err2) {
				console.error(err2);
			}
		}

		if (!output) return message.channel.send(language.errors.shell).catch(console.error);

		const charactersPerPage = 2000;
		if (output.length < charactersPerPage) {
			message.channel.send({
				embed: {
					author: {
						name: "Heroku Logs",
						icon_url: message.author.displayAvatarURL({ dynamic: true })
					},
					color: message.guild.me.displayColor,
					description: `\`\`\`\n${output || "*-*"}\n\`\`\``,
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
					.setAuthor("Heroku Logs", message.author.displayAvatarURL({ dynamic: true }))
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