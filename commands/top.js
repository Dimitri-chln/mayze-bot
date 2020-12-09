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

		await message.guild.members.fetch().catch(console.error);

		var top;
		try {
			const { rows } = await message.client.pg.query("SELECT * FROM levels ORDER BY xp DESC");
			top = rows;
		} catch (err) {
			console.error(err);
			return message.channel.send("Quelque chose s'est mal passé en joignant la base de données :/").catch(console.error);
		}

		const memberPerPage = 15, xpPerLevel = 1000;
		var pages = [];
		var embed = new MessageEmbed()
			.setAuthor(`Classement de ${message.guild.name}`, message.client.user.avatarURL())
			.setColor("#010101")
			.setDescription("*Aucun membre n'est encore classé*");
		if (!top.length) {
			pages.push(embed);
		};
		for (i = 0; i < top.length; i += memberPerPage) {
			embed = new MessageEmbed()
				.setAuthor(`Classement de ${message.guild.name}`, message.client.user.avatarURL())
				.setColor("#010101")
				.setDescription(top.slice(i, i + memberPerPage).map((user, i) => `\`${i + 1}.\` <@${user.user_id}> - **Niveau \`${Math.floor(user.xp / xpPerLevel)}\`**`).join("\n"));
			pages.push(embed);
		};
		
		try { pagination(message, pages); }
		catch (err) {
			console.log(err);
			message.channel.send("Quelque chose s'est mal passé en créant le paginateur").catch(console.error);
		}
	}
};

module.exports = command;