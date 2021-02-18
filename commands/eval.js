const { Message } = require("discord.js");

const command = {
	name: "eval",
	description: "Évaluer une expression",
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
			? args.join(" ").replace("##", "message.channel.send")
			: options[0].value.replace("##", "message.channel.send");
		try {
			eval(expression);
		} catch (err) {
			console.log(err);
			message.channel.send(`__Erreur:__\`\`\`\n${err}\n\`\`\``).catch(console.error);
		};
	}
};

module.exports = command;