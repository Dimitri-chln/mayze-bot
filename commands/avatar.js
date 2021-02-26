const { Message } = require("discord.js");

const command = {
	name: "avatar",
	description: {
		fr: "Obtenir la photo de profil d'un utilisateur",
		en: "Get a user's profile picture"
	},
	aliases: ["pfp", "pp"],
	args: 0,
	usage: "[<user>]",
	slashOptions: [
		{
			name: "user",
			description: "A user to get the profile picture from",
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
		const user = args
			? message.mentions.users.first() || (message.client.findMember(message.guild, args.join(" ")) || {}).user || message.author
			: message.guild.members.cache.get(options[0].value).user || message.author;
		
		message.channel.send({
			embed: {
				author: {
					name: language.get(language.title, message.author.tag),
					icon_url: message.client.user.avatarURL()
				},
				color: "#010101",
				image: {
					url: user.avatarURL({ size: 4096, dynamic: true })
				},
				footer: {
					text: "✨ Mayze ✨"
				}
			}
		}).catch(console.error);
	}
};

module.exports = command;