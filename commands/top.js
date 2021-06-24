const { Message } = require("discord.js");

const command = {
	name: "top",
	description: {
		fr: "Obtenir le classement d'xp des membres",
		en: "Get the xp leaderboard of members "
	},
	aliases: ["leaderboard", "lb", "topxp"],
	args: 0,
	usage: "[text | voice]",
	botPerms: ["EMBED_LINKS", "ADD_REACTIONS", "MANAGE_MESSAGES"],
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, language, languageCode) => {
		const pagination = require("../utils/pagination");
		const getLevel = require("../utils/getLevel");
		const { MessageEmbed } = require("discord.js");

		const leaderboard = args.length
			? args[0].toLowerCase() === "voice" ? "voice_xp" : "chat_xp"
			: "chat_xp";

		let { "rows": top } = (await message.client.pg.query(`SELECT * FROM levels ORDER BY ${leaderboard} DESC`).catch(console.error)) || {};
		if (!top) return message.reply(language.errors.database).catch(console.error);

		top = top.filter(u => message.guild.members.cache.has(u.user_id));

		const memberPerPage = 15;

		let pages = [];
		let embed = new MessageEmbed()
			.setAuthor(language.get(language.title, message.guild.name, leaderboard === "chat_xp"), message.client.user.avatarURL())
			.setColor(message.guild.me.displayColor)
			.setDescription(language.no_member);
		if (!top.length) pages.push(embed);

		for (i = 0; i < top.length; i += memberPerPage) {
			embed = new MessageEmbed()
				.setAuthor(language.get(language.title, message.guild.name, leaderboard === "chat_xp"), message.client.user.avatarURL())
				.setColor(message.guild.me.displayColor)
				.setDescription(top.slice(i, i + memberPerPage).map((user, i) => language.get(language.description, i + 1, message.guild.members.cache.get(user.user_id).user.username, getLevel(user[leaderboard]).level)).join("\n"));
			pages.push(embed);
		};
		
		pagination(message, pages).catch(err => {
			console.error(err);
			message.channel.send(language.errors.paginator).catch(console.error);
		});
	}
};

module.exports = command;