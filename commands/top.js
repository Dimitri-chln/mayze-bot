const { Message } = require("discord.js");

const command = {
	name: "top",
	description: "Obtenir le classement des membres selon leur xp",
	aliases: ["leaderboard", "lb", "topxp"],
	args: 0,
	usage: "",
	slashOptions: null,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options) => {
		const pagination = require("../util/pagination.js");
		const { MessageEmbed } = require("discord.js");

		const { "rows": top } = await message.client.pg.query("SELECT * FROM levels ORDER BY xp DESC").catch(console.error);
		const memberPerPage = 15;
		const { BASE_XP, XP_INCREMENT } = require("../config.json");

		let pages = [];
		let embed = new MessageEmbed()
			.setAuthor(`Classement de ${message.guild.name}`, message.client.user.avatarURL())
			.setColor("#010101")
			.setDescription("*Aucun membre n'est encore classé*");
		if (!top.length) pages.push(embed);

		for (i = 0; i < top.length; i += memberPerPage) {
			embed = new MessageEmbed()
				.setAuthor(`Classement de ${message.guild.name}`, message.client.user.avatarURL())
				.setColor("#010101")
				.setDescription(top.slice(i, i + memberPerPage).map((user, i) => `\`${i + 1}.\` **${(message.guild.members.cache.get(user.user_id) || { user: { username: "*Inconnu*" } }).user.username}** - **Niveau \`${getLevel(user.xp)}\`**`).join("\n"));
			pages.push(embed);
		};
		
		pagination(message, pages).catch(console.error);

		function getLevel(xp, lvl = 0) {
			const xpPerLevel = BASE_XP + lvl * XP_INCREMENT;
			if (xp < xpPerLevel) return lvl;
			return getLevel(xp - xpPerLevel, lvl + 1);
		}
	}
};

module.exports = command;