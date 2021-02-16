const { Message } = require("discord.js");

const command = {
	name: "hug",
	description: "Faire un câlin à quelqu'un !",
	aliases: [],
	args: 1,
	usage: "<mention>",
	slashOptions: [
		{
			name: "utilisateur",
			description: "La personne à qui faire un calîn",
			type: 6,
			required: true
		}
	],
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options, languages, language) => {
		const hugs = require("../assets/hugs.json");
		const user = args
			? message.mentions.users.first() || message.client.user
			: message.guild.members.cache.get(options[0].value).user;
			
		message.channel.send({
			embed: {
				author: {
					name: `${message.author.username} fait un câlin à ${user.username} 🤗`,
					icon_url: message.author.avatarURL({ dynamic: true })
				},
				color: "#010101",
				image: {
					url: hugs[Math.floor(Math.random() * hugs.length)]
				},
				footer: {
					text: "✨Mayze✨"
				}
			}
		}).catch(console.error);
	}
};

module.exports = command;