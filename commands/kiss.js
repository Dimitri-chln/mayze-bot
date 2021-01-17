const { Message } = require("discord.js");

const command = {
	name: "kiss",
	description: "Faire un bisous à quelqu'un !",
	aliases: [],
	args: 1,
	usage: "<mention>",
	slashOptions: [
		{
			name: "utilisateur",
			description: "La personne à qui faire un bisou",
			type: 6,
			required: true
		}
	],
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options) => {
		const kisses = require("../assets/kisses.json");
		const user = args
			? message.mentions.users.first() || message.client.user
			: message.guild.members.cache.get(options[0].value).user;

		message.channel.send({
			embed: {
				author: {
					name: `${message.author.username} fait un bisous à ${user.username} 😘`,
					icon_url: message.author.avatarURL({ dynamic: true })
				},
				color: "#010101",
				image: {
					url: kisses[Math.floor(Math.random() * kisses.length)]
				},
				footer: {
					text: "✨Mayze✨"
				}
			}
		}).catch(console.error);
	}
};

module.exports = command;