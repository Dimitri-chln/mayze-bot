const { Message } = require("discord.js");

const command = {
	name: "unbelievaboat-balance",
	description: "Obtenir ta balance UnbelieveBoat",
	aliases: ["unb-balance", "unbelievaboat-bal", "balance", "bal"],
	args: 0,
	usage: "",
	botPerms: ["EMBED_LINKS"],
	onlyInGuilds: ["689164798264606784"],
	category: "miscellaneous",
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options, language, languageCode) => {
		const { Client } = require("unb-api");
		const unbClient = new Client(process.env.UNB_TOKEN);
		
		const user = await unbClient.getUserBalance(message.guild.id, message.author.id).catch(console.error);
		if (!user) return message.channel.send("Quelque chose s'est mal passé en accédant à l'API d'Unbelieveboat").catch(console.error);

		message.channel.send({
			embed: {
				author: {
					name: `Balance Unbelievaboat de ${message.author.tag}`,
					icon_url: message.author.avatarURL({ dynamic: true })
				},
				color: message.guild.me.displayColor,
				description: `• Rang: **#${user.rank.toLocaleString()}**\n• Cash: **✨${user.cash.toLocaleString()}**\n• Bank: **✨${user.bank.toLocaleString()}**\n• Total: **✨${user.total.toLocaleString()}**`,
				footer: {
					text: "✨ Mayze ✨"
				}
			}
		}).catch(console.error);
	}
};

module.exports = command;