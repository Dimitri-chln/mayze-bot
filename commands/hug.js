const { Message } = require("discord.js");

const command = {
	name: "hug",
	description: {
		fr: "Faire un câlin à quelqu'un !",
		en: "Hug someone!"
	},
	aliases: [],
	args: 1,
	usage: "<user>",
	slashOptions: [
		{
			name: "user",
			description: "The user to hug",
			type: 6,
			required: true
		}
	],
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options, language, languageCode) => {
		const hugs = require("../assets/hugs.json");
		const user = args
			? message.mentions.users.first() || message.client.user
			: message.guild.members.cache.get(options[0].value).user;
			
		message.channel.send({
			embed: {
				author: {
					name: language.get(language.title, message.author.username, user.username),
					icon_url: message.author.avatarURL({ dynamic: true })
				},
				color: message.guild.me.displayColor,
				image: {
					url: hugs[Math.floor(Math.random() * hugs.length)]
				},
				footer: {
					text: "✨ Mayze ✨"
				}
			}
		}).catch(console.error);
	}
};

module.exports = command;