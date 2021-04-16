const { Message } = require("discord.js");

const command = {
	name: "love",
	description: {
		fr: "Calculer le pourcentage d'amour entre 2 personnes",
		en: "Calculate the love percentage between 2 people"
	},
	aliases: [],
	args: 1,
	usage: "<user> [<user>]",
	slashOptions: [
		{
			name: "user",
			description: "The first person to do the test with",
			type: 6,
			required: true
		},
		{
			name: "other-user",
			description: "Another person",
			type: 6,
			required: false
		}
	],
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options, language, languageCode) => {
		const love1 = args
			? message.mentions.users.first() || args[0]
			: message.client.users.cache.get(options[0].value);
		const love2 = args
			? message.mentions.users.first(2)[1] || args[1] || message.author
			: options[1] ? message.client.users.cache.get(options[1].value) : message.author;

		message.channel.send({
			embed: {
				title: "💕 Love Calculator 💕",
				color: message.guild.me.displayColor,
				description: `${love1} + ${love2} = ${Math.round(Math.random() * 100)}%`,
				footer: {
					text: "✨ Mayze ✨"
				}
			}
		}).catch(console.error);
	}
};

module.exports = command;