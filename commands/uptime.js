const { Message } = require("discord.js");

const command = {
	name: "uptime",
	description: "Le temps depuis lequel le bot est en ligne",
	aliases: [],
	args: 0,
	usage: "",
	slashOptions: null,
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options) => {
		const timeToString = require("../utils/timeToString.js");
		const uptime = Date.now() - message.client.readyAt;
		const uptimeString = timeToString(uptime / 1000);
		message.channel.send(`Je suis en ligne depuis ${uptimeString} !`).catch(console.error);
	}
};

module.exports = command;