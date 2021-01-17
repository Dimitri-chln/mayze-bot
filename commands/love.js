const { Message } = require("discord.js");

const command = {
	name: "love",
	description: "Calculer le pourcentage d'amour entre 2 personnes",
	aliases: [],
	args: 1,
	usage: "<mention/texte> [mention/texte]",
	slashOptions: [
		{
			name: "utilisateur",
			description: "La personne avec qui faire le test",
			type: 6,
			required: true
		},
		{
			name: "autre-utilisateur",
			description: "Une deuxième personne avec qui faire le test",
			type: 6,
			required: false
		}
	],
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options) => {
		const love1 = args
			? message.mentions.users.first() || args[0]
			: message.client.users.cache.get(options[0].value);
		const love2 = args
			? message.mentions.users.first(2)[1] || args[1] || message.author
			: message.client.users.cache.get((options[1] || {}).value);
		message.channel.send({
			embed: {
				title: "💕 Love Calculator 💕",
				color: "#010101",
				description: `${love1} + ${love2} = ${Math.round(Math.random() * 100)}%`,
				footer: {
					text: "✨Mayze✨"
				}
			}
		}).catch(console.error);
	}
};

module.exports = command;