const { Message } = require("discord.js");

const command = {
	name: "rank",
	description: "Rejoindre ou quitter un rank",
	aliases: [],
	args: 0,
	usage: "[rank]",
	onlyInGuilds: ["689164798264606784"],
	slashOptions: [
		{
			name: "rank",
			description: "Le rank à rejoindre ou à quitter",
			type: 3,
			required: false
		}
	],
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, language, languageCode) => {
		const rankIdOrName = args
			? (args.join(" ") || "").toLowerCase()
			: (options ? options[0] : {}).value.toLowerCase();
		if (message.member.roles.cache.has("695943648235487263")) return; // If jailed
		
		const roleTop = message.guild.roles.cache.get("735810286719598634");
		const roleBottom = message.guild.roles.cache.get("802143220984971275");
		const ranks = message.guild.roles.cache.filter(r => r.position < roleTop.position && r.position > roleBottom.position && !r.name.includes("(Jailed)"));

		if (rankIdOrName) {
			const rank = message.guild.roles.cache.get(rankIdOrName) || ranks.find(r => r.name.toLowerCase() === rankIdOrName) || ranks.find(r => r.name.toLowerCase().includes(rankIdOrName)) || { id: "" };
			if (!ranks.has(rank.id)) return message.reply("ce rank n'existe pas").catch(console.error);
		
			if (!message.member.roles.cache.has(rank.id)) {
				try{
					await message.member.roles.add(rank);
					message.channel.send(`${message.author} a rejoint le rank \`${rank.name}\``).catch(console.error);
				} catch (err) {
					console.error(err);
					message.channel.send("Quelque chose s'est mal passé en te donnant le rôle :/").catch(console.error);
				}
			}
			if (message.member.roles.cache.has(rank.id)) {
				try {
					await message.member.roles.remove(rank);
					message.channel.send(`${message.author} a quitté le rank \`${rank.name}\``).catch(console.error);
				} catch (err) {
					console.log(err);
					message.channel.send("Quelque chose s'est mal passé en te retirant le rôle :/").catch(console.error);
				}
			}
		} else {
			message.channel.send({
				embed: {
					author: {
					name: "Ranks du serveur 🎗️",
					icon_url: message.client.user.avatarURL()
					},
					color: "#010101",
					description: ranks.map(rank => `• ${rank}${message.member.roles.cache.has(rank.id) ? ` | ✅` : ""}`).join("\n"),
					footer: {
					text: "✨ Mayze ✨"
					}
				}
			}).catch(console.error);
		}
	}
};

module.exports = command;