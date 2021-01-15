const { Message } = require("discord.js");

const command = {
	name: "kickmyself",
	description: "T'expulser du serveur sans aucune raison",
	aliases: ["kms"],
	args: 0,
	usage: "",
	slashOptions: null,
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	async execute(message, args, options) {
		const member = await message.member.kick("S'est kick lui-même").catch(console.error);
		if (member) message.channel.send(`**${message.author.username}** s'est kick lui-même 👀`).catch(console.error);
		else message.channel.send(`Quelque chose s'est mal passé en t'expulsant du serveur :/`).catch(console.error);
	}
};

module.exports = command;