const { Message } = require("discord.js");

const command = {
	name: "kickmyself",
	description: "Te permet de te kick du serveur sans aucune raison",
	aliases: ["kms"],
	args: 0,
	usage: "",
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 */
	async execute(message, _args) {
		const member = await message.member.kick("S'est kick lui-même").catch(console.error);
		if (member) message.channel.send(`**${message.author.username}** s'est kick lui-même 👀`).catch(console.error);
		else message.channel.send(`Quelque chose s'est mal passé en t'expulsant du serveur :/`).catch(console.error);
	}
};

module.exports = command;