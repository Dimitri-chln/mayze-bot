const { Message } = require("discord.js");

const command = {
	name: "unbelievaboat-shop",
	description: "La liste des objets à vendre sur le serveur",
	aliases: ["unb-shop"],
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
	run: async (message, args, options, language, languageCode) => {
		const shop = require("../assets/unb-shop");
		message.channel.send({
			embed: {
				author: {
					name: "Shop Unbelievaboat",
					iconURL: message.client.user.displayAvatarURL()
				},
				color: message.guild.me.displayColor,
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