const { Message } = require("discord.js");

const command = {
	name: "nude",
	description: "Recevoir un nude de quelqu'un",
	aliases: ["miam"],
	cooldown: 600,
	args: 0,
	usage: "",
	botPerms: ["ADD_REACTIONS"],
	onlyInGuilds: ["689164798264606784"],
	category: "miscellaneous",
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options, language, languageCode) => {
		const nudes = require("../assets/nudes.json");
		if (!message.isInteraction) message.react("😏").catch(console.error);
		else message.reply("😏").catch(console.error);

		message.author.send({
			embed: {
				title: "Miam 😏",
				color: message.guild.me.displayColor,
				image: {
					url: nudes[Math.floor(Math.random() * nudes.length)]
				},
				footer: {
					text: "✨ Mayze ✨"
				}
			}
		}).catch(console.error);
	}
};

module.exports = command;