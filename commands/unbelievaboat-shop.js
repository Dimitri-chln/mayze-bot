const { Message } = require("discord.js");

const command = {
	name: "unbelievaboat-shop",
	description: "La liste des objets à vendre sur le serveur",
	aliases: ["unb-shop", "shop"],
	args: 0,
	usage: "",
	onlyInGuilds: ["689164798264606784"],
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options, language, languageCode) => {
		const shop = require("../assets/unb-shop");
		message.channel.send({
			embed: {
				author: {
					name: "Shop Unbelievaboat",
					icon_url: message.client.user.avatarURL()
				},
				color: message.guild.me.displayHexColor,
				fields: shop.map(item => {
					return { name: `• ${item.name} - ✨${item.price}`, value: `*${item.description}*`, inline: true }
				}),
				footer: {
					text: "✨ Mayze ✨"
				}
			}
		}).catch(console.error);
	}
};

module.exports = command;