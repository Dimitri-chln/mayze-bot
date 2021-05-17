const { Message, Collection } = require("discord.js");
const Palette = require("../utils/canvas/Palette");

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
		const pagination = require("../utils/pagination");
		const { MessageEmbed } = require("discord.js");
		/**@type Collection<string, Palette> */
		const palettes = message.client.palettes;

		let pages = [];
		for (let [ name, palette ] of palettes) {
			let embed = new MessageEmbed()
				.setAuthor(language.title, message.client.user.avatarURL())
				.setTitle(language.get(language.palette, name))
				.setColor(message.guild.me.displayColor)
				.setDescription(Array.from(palette.all()).map(([alias, color]) => `${color.emote} \`${alias}\` - **${color.name.replace(/U\+0027/g, "'")}** \`${color.hexadecimal}\``).join("\n"))
				.setFooter("✨ Mayze ✨")
			pages.push(embed);
		}

		try {
			pagination(message, pages);
		} catch (err) {
			console.error(err);
			message.channel.send(language.error.paginator).catch(console.error);
		}
	}
};

module.exports = command;