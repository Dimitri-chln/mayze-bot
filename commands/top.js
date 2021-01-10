const { Message } = require("discord.js");

const command = {
	name: "top",
	description: "Donne le classement des membres selon leur xp",
	aliases: ["leaderboard", "lb", "topxp", "topXP"],
	args: 0,
	usage: "",
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 */
	async execute(message, args) {
		const pagination = require("../modules/pagination.js");
		const { MessageEmbed } = require("discord.js");

		const { "rows": top } = await message.client.pg.query("SELECT * FROM levels ORDER BY xp DESC").catch(console.error);
		const memberPerPage = 15;
		const { baseXp } = require("../config.json");

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
		
		try { pagination(message, pages); }
		catch (err) {
			console.error(err);
			message.channel.send("Quelque chose s'est mal passé en créant le paginateur").catch(console.error);
		}

		function getLevel(xp, lvl = 0) {
			const xpPerLevel = baseXp + lvl * 250;
			if (xp < xpPerLevel) return lvl;
			return getLevel(xp - xpPerLevel, lvl + 1);
		}
	}
};

module.exports = command;