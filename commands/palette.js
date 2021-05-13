const { Message } = require("discord.js");
const Color = require("../utils/canvas/Color");

const command = {
	name: "palette",
	description: {
		fr: "Voir la palette de couleurs disponibles",
		en: "See the palette of availables colors"
	},
	aliases: [],
	args: 0,
	usage: "",
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, language, languageCode) => {
		/**@type Map<string, Color> */
		const colors = message.client.canvas.palette.all();
		const emojis = message.client.guilds.cache.get("744291144946417755").emojis.cache;
		const noTexture = emojis.find(e => e.name === "no_texture");

		message.channel.send({
			embed: {
				author: {
					name: language.title,
					icon_url: message.client.user.avatarURL()
				},
				color: message.guild.me.displayColor,
				description: Array.from(colors).map(([alias, color]) => `${emojis.find(e => e.name === `pl_${alias}`) || noTexture} \`${alias}\` - **${color.name}** \`${color.hexadecimal}\``).join("\n"),
				footer: {
					text: "✨ Mayze ✨"
				}
			}
		}).catch(console.error);
	}
};

module.exports = command;