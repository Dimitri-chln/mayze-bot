const { Message } = require("discord.js");

const command = {
	name: "test",
	description: "testest",
	aliases: [],
	args: 0,
	usage: "",
	ownerOnly: true,
	/**
	 * 
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, language) => {
		const number = parseInt(args[0].slice(12));
		const base = parseInt(args[1] || 36);
		const encoded = number.toString(base);
		const decoded = parseInt(encoded, base);

		message.channel.send(`Input: \`${args[0]}\`\nParsed: \`${number}\`\nEncoded (base ${base}): \`${encoded}\`\nDecoded: \`${decoded}\``);
	}
};

module.exports = command;