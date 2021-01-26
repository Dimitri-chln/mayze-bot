const { Message } = require("discord.js");

const command = {
	name: "leave",
	description: "Quitter un salon vocal",
	aliases: [],
	args: 0,
	usage: "",
	disableSlash: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	execute: async (message, args, options) => {
		if (!message.client.music) message.client.music = {};
        const connection = message.client.music[message.guild.id];
        if (!connection) return message.reply("je ne suis pas connecté à un salon vocal").catch(console.error);
        
        connection.disconnect().catch(console.error);
        message.channel.send(`Déconnecté de ${connection.channel}`).catch(console.error);
	}
};

module.exports = command;