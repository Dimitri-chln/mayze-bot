const { Message } = require("discord.js");

const command = {
	name: "nude",
	description: "Recevoir un nude de quelqu'un",
	aliases: ["miam"],
	cooldown: 600,
	args: 0,
	usage: "",
	slashOptions: null,
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options) => {
		const nudes = require("../assets/nudes.json");
		if (message.deletable) message.react("😏").catch(console.error);
		message.author.send({
			embed: {
				title: "Miam 😏",
				color: "#010101",
				image: {
					url: nudes[Math.floor(Math.random() * nudes.length)]
				},
				footer: {
					text: "✨Mayze✨"
				}
			}
		}).catch(console.error);
	}
};

module.exports = command;