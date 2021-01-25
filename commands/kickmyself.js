const { Message } = require("discord.js");

const command = {
	name: "kickmyself",
	description: "T'expulser du serveur sans aucune raison",
	aliases: ["kms", "4-4-2"],
	args: 0,
	usage: "",
	slashOptions: null,
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options) => {
		const member = await message.member.kick("S'est kick lui-même").catch(console.error);
		const responses = require("../assets/kickms.json");
		if (member) message.channel.send(`**${message.author.username}** ${responses[Math.floor(Math.random() * responses.length)]}...`).catch(console.error);
		else message.channel.send(`Quelque chose s'est mal passé en t'expulsant du serveur :/`).catch(console.error);
	}
};

module.exports = command;