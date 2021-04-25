const { Message } = require("discord.js");

const command = {
	name: "eval",
	description: {
		fr: "Évaluer une expression",
		en: "Evaluate an expression"
	},
	aliases: [],
	cooldown: 1,
	args: 1,
	usage: "<expression>",
	ownerOnly: true,
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
   execute: async (message, args, options, language, languageCode) => {
		const expression = args
			? args.join(" ").replace(/##/g, "message.channel.send")
			: options[0].value.replace(/##/g, "message.channel.send");
		try {
			eval(expression);
		} catch (err) {
			console.error(err);
			message.channel.send(`__**Error:**__\`\`\`\n${err}\n\`\`\``).catch(console.error);
		};
	}
};

module.exports = command;