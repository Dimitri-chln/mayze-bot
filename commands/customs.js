const { Message } = require("discord.js");

const command = {
	name: "customs",
	description: "Gérer les intrus au serveur",
	aliases: ["douane", "d"],
	args: 2,
	usage: "info <user> | kick <user> | ban <user>",
	botPerms: ["KICK_MEMBERS", "BAN_MEMBERS"],
	onlyInGuilds: ["689164798264606784"],
	category: "utility",
	newbiesAllowed: true,
	disableSlash: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, language, languageCode) => {
		const customsOfficer = message.guild.roles.cache.get("866000780241534987");
		const isCustomsOfficer = member => member.roles.cache.has(customsOfficer.id);
		if (!isCustomsOfficer(message.member)) return;
		if (message.channel.id !== "865997369745080341") return;

		/**@type {import("discord.js").GuildMember} */
		const member = message.mentions.members.first() ?? message.client.findMember(message.guild, args.slice(1).join(" "));
        if (!member) return message.reply("mentionne un membre").catch(console.error);
		if (member.roles.cache.has("689169027922526235") || member.roles.cache.has("689169136374644752")) return;

		const subCommand = args
			? args[0].toLowerCase()
			: options[0].value;
		
		switch (subCommand) {
			case "info":
				message.channel.send({
					embed: {
						author: {
							name: member.user.tag,
							url: member.user.displayAvatarURL({ dynamic: true })
						},
						thumbnail: {
							url: member.user.displayAvatarURL({ dynamic: true })
						},
						color: message.guild.me.displayColor,
						fields: [
							{
								name: "Rôles",
								value: member.roles.cache.map(r => r.toString()).join(", "),
								inline: true
							},
							{
								name: "Création du compte",
								value: `<t:${Math.round(member.user.createdTimestamp / 1000)}:R>`,
								inline: true
							},
							{
								name: "Date d'arrivée",
								value: `<t:${Math.round(member.joinedAt / 1000)}:R>`,
								inline: true
							}
						],
						footer: {
							text: "✨ Mayze ✨"
						}
					}
				}).catch(console.error);
				break;
			case "kick":
				member.kick("N'a pas passé la douane")
					.then(() => message.channel.send(`**${member.user.tag}** n'a pas passé la douane`).catch(console.error))
					.catch(err => {
						console.error(err);
						message.channel.send(`Quelque chose s'est mal passé en expulsant **${member.user.tag}** :/`).catch(console.error);
					});
				break;
			case "ban":
				member.ban({ reason: "N'est aimé de personne ici" })
					.then(() => message.channel.send(`**${member.user.tag}** n'est aimé de personne ici`).catch(console.error))
					.catch(err => {
						console.error(err);
						message.channel.send(`Quelque chose s'est mal passé en bannissant **${member.user.tag}** :/`).catch(console.error);
					});
				break;
			default:
				return message.reply(language.invalid_args).catch(console.error);
		}
	}
};

module.exports = command;