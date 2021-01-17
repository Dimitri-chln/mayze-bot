const { Message } = require("discord.js");

const command = {
	name: "jail",
	description: "Mettre un membre en prison ou le libérer",
	aliases: [],
	cooldown: 5,
	args: 1,
	usage: "<mention>",
	perms: ["MANAGE_ROLES"],
	onlyInGuilds: ["689164798264606784"],
	slashOptions: [
		{
			name: "utilisateur",
			description: "La personne à mettre en prison ou à libérer",
			type: 6,
			required: true
		}
	],
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options) => {
		const { ownerID } = require("../config.json");

		const user = args
			? message.mentions.users.first()
			: (message.guild.members.cache.get(options[0].value) || {}).user;
		if (!user) return message.reply("mentionne la personne à mettre en prison ou à libérer").catch(console.error);
		const member = message.guild.members.cache.get(user.id);
		if (member.roles.highest.position >= message.member.roles.highest.position && message.author.id !== ownerID) 
			return message.reply("tu ne peux pas mettre cette personne en prison").catch(console.error);

		const roleTop = message.guild.roles.cache.get("735810286719598634");
		const roleBottom = message.guild.roles.cache.get("735810462872109156");
		const ranks = message.guild.roles.cache.filter(r => r.position < roleTop.position && r.position > roleBottom.position);
		const jailedRole = "695943648235487263";

		if (!member.roles.cache.has(jailedRole)) { // If not jailed
			member.roles.add(jailedRole).catch(console.error);
			const notJailedRanks = ranks.filter(r => !r.name.includes("(Jailed)"));
			notJailedRanks.forEach(rank => {
				const jailedRank = ranks.find(r => r.name === rank.name + " (Jailed)");
				if (member.roles.cache.has(rank.id)) {
					member.roles.remove(rank).catch(console.error);
					member.roles.add(jailedRank).catch(console.error);
				}
			});

			if (member.roles.cache.has("689180158359371851")) { // Administrateur
				member.roles.remove("689180158359371851").catch(console.error);
				member.roles.add("753245162469064795").catch(console.error);
			}
			if (member.roles.cache.has("737646140362850364")) { // Modérateur
				member.roles.remove("737646140362850364").catch(console.error);
				member.roles.add("753250476891439185").catch(console.error);
			}
			if (member.roles.cache.has("696751614177837056")) { // Sous Chef
				member.roles.remove("696751614177837056").catch(console.error);
				member.roles.add("753251533768097933").catch(console.error);
			}
			if (member.roles.cache.has("689218691560505472")) { // 👑🐍•🐣✨•🌙🐒•⚡🦅•🦄❄️
				member.roles.remove("689218691560505472").catch(console.error);
				member.roles.add("753253307052589176").catch(console.error);
			}
			if (message.deletable) message.react("🔗").catch(console.error);

		} else { // If jailed
		member.roles.remove(jailedRole).catch(console.error);
		const jailedRanks = ranks.filter(r => r.name.includes("(Jailed)"));
		jailedRanks.forEach(rank => {
			const notJailedRank = ranks.find(r => r.name + " (Jailed)" === rank.name);
			if (member.roles.cache.has(rank.id)) {
				member.roles.remove(rank).catch(console.error);
				member.roles.add(notJailedRank).catch(console.error);
			}
		});
		if (member.roles.cache.has("753245162469064795")) { // Administrateur
			member.roles.remove("753245162469064795").catch(console.error);
			member.roles.add("689180158359371851").catch(console.error);
		}
		if (member.roles.cache.has("753250476891439185")) { // Modérateur
			member.roles.remove("753250476891439185").catch(console.error);
			member.roles.add("737646140362850364").catch(console.error);
		}
		if (member.roles.cache.has("753251533768097933")) { // Sous Chef
			member.roles.remove("753251533768097933").catch(console.error);
			member.roles.add("696751614177837056").catch(console.error);
		}
		if (member.roles.cache.has("753253307052589176")) { // 👑🐍•🐣✨•🌙🐒•⚡🦅•🦄❄️
			member.roles.remove("753253307052589176").catch(console.error);
			member.roles.add("689218691560505472").catch(console.error);
		}
		if (message.deletable) message.react("👋").catch(console.error);
		}
	}
};

module.exports = command;