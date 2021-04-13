const { Message } = require("discord.js");

const command = {
	name: "kiss",
	description: {
		fr: "Faire un bisous à quelqu'un !",
		en: "Kiss someone!"
	},
	aliases: [],
	args: 1,
	usage: "<user> [cheek]",
	slashOptions: [
		{
			name: "user",
			description: "The user to kiss",
			type: 6,
			required: true
		},
		{
			name: "cheek",
			description: "Whether you want to kiss the user on the cheek or not",
			type: 5,
			required: false,
			choices: [
				{
					name: "Kiss on the cheek",
					value: true
				},
				{
					name: "Don't kiss on the cheek",
					value: false
				}
			]
		}
	],
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options, language, languageCode) => {
		const kisses = require("../assets/kisses.json");
		const user = args
			? message.mentions.users.first() || message.client.user
			: message.guild.members.cache.get(options[0].value).user;
		const cheek = args
			? args.includes("cheek")
			: options[1] ? options[1].value : false;

		const links = cheek ? kisses.cheek : kisses.cheek.concat(kisses.mouth);

		message.channel.send({
			embed: {
				author: {
					name: language.get(language.title, message.author.username, user.username),
					icon_url: message.author.avatarURL({ dynamic: true })
				},
				color: message.guild.me.displayColor,
				image: {
					url: links[Math.floor(Math.random() * links.length)]
				},
				footer: {
					text: "✨ Mayze ✨"
				}
			}
		}).catch(console.error);
	}
};

module.exports = command;