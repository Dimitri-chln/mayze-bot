const { Message } = require("discord.js");

const command = {
	name: "giveaway",
	description: "Créer et gérer des giveaway",
	aliases: ["gwa", "ga"],
	args: 1,
	usage: "create \"<prix>\" <durée> [<nombre gagnants>] [-mention <rôle>] [-role <rôle>] | end [<ID>] | delete [<ID>] | reroll [<ID>]",
	botPerms: ["EMBED_LINKS", "ADD_REACTIONS", "MANAGE_MESSAGES"],
	onlyInGuilds: ["689164798264606784"],
	slashOptions: [
		{
			name: "create",
			description: "Créer un giveaway",
			type: 1,
			options: [
				{
					name: "prix",
					description: "Le prix à gagner",
					type: 3,
					required: true
				},
				{
					name: "durée",
					description: "La durée du giveaway",
					type: 3,
					required: true
				},
				{
					name: "gagnants",
					description: "Le nombre de gagnants",
					type: 4,
					required: false
				},
				{
					name: "mention",
					description: "Un rôle à mentionner au lancement du giveaway",
					type: 8,
					required: false
				},
				{
					name: "rôle",
					description: "Un rôle nécessaire pour participer",
					type: 8,
					required: false
				}
			]
		},
		{
			name: "end",
			description: "Arrêter un giveaway",
			type: 1,
			options: [
				{
					name: "id",
					description: "L'ID de 4 lettres du giveaway",
					type: 3,
					required: false
				}
			]
		},
		{
			name: "delete",
			description: "Annuler un giveaway",
			type: 1,
			options: [
				{
					name: "id",
					description: "L'ID de 4 lettres du giveaway",
					type: 3,
					required: false
				}
			]
		},
		{
			name: "reroll",
			description: "Désigner un nouveau gagnant",
			type: 1,
			options: [
				{
					name: "id",
					description: "L'ID de 4 lettres du giveaway",
					type: 3,
					required: false
				}
			]
		}
	],
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {object[]} options 
	 */
	execute: async (message, args, options, language, languageCode) => {
		const dhms = require("dhms");
		const timeToString = require("../utils/timeToString");
		const updateGwaMsg = require("../utils/updateGwaMsg");
		const { GIVEAWAY_CHANNEL_ID } = require("../config.json");
		const channel = message.channel.id === GIVEAWAY_CHANNEL_ID
			? message.channel
			: message.client.channels.cache.get(GIVEAWAY_CHANNEL_ID);

		if (!message.member.hasPermission("MANAGE_MESSAGES") && !message.member.roles.has("815884135410958336"))
			return message.reply("tu n'as pas la permission de créer des giveaways").catch(console.error);

		const subCommand = args
			? args[0].toLowerCase()
			: options[0].name;
		
		switch (subCommand) {
			case "create": {
				const prize = args
					? args[1].replace(/^./, a => a.toUpperCase())
					: options[0].options[0].value.replace(/^./, a => a.toUpperCase());
				if (!prize) return message.reply("écris le prix entre guillemets").catch(console.error);
				const duration = args
					? dhms(args[2])
					: dhms(options[0].options[1].value);
				if (!duration) return message.reply("la durée est invalide (dhms)").catch(console.error);
				const endTimestamp = new Date(Date.now() + duration);
				const winners = args
					? args[3] ? (isNaN(parseInt(args[3].replace(/^(\d+)w?/, "$1"))) ? 1 : parseInt(args[3].replace(/^(\d+)w?/, "$1", ""))) : 1
					: options[0].options.some(o => o.name === "gagnants") ? options[0].options.find(o => o.name === "gagnants").value : 1;
				if (winners < 1) return message.reply("le nombre de gagnants doit être supérieur à 1");
				const mention = args
					? args.includes("-mention") ? message.guild.roles.cache.find(role => role.id === args[args.indexOf("-mention") + 1] || role.name.toLowerCase() === args[args.indexOf("-mention") + 1].toLowerCase() || role.name.toLowerCase().includes(args[args.indexOf("-mention") + 1].toLowerCase())) : null
					: options[0].options.some(o => o.name === "mention") ? message.guild.roles.cache.get(options[0].options.find(o => o.name === "mention").value) : null;
				const role = args
					? args.includes("-role") ? message.guild.roles.cache.find(role => role.id === args[args.indexOf("-mention") + 1] || role.name.toLowerCase() === args[args.indexOf("-mention") + 1].toLowerCase() || role.name.toLowerCase().includes(args[args.indexOf("-mention") + 1].toLowerCase())) : null
					: options[0].options.some(o => o.name === "rôle") ? message.guild.roles.cache.get(options[0].options.find(o => o.name === "rôle").value) : null;
				
				const msg = await channel.send({
					content: mention ? `${mention}` : "<@&816233807215853568>",
					embed: {
						author: {
							name: `Giveaway de ${message.author.tag}`,
							icon_url: message.author.avatarURL({ dynamic: true })
						},
						color: message.guild.me.displayColor,
						title: prize,
						description: `\`Temps restant:\` ${timeToString((endTimestamp.valueOf() - Date.now()) / 1000)}` + (role ? `\n\`Uniquement pour:\` ${role}` : ""),
						footer: {
							text: `${winners} gagnant${winners === 1 ? "" : "s"} | ID: En attente... | Fin du giveaway`
						},
						timestamp: new Date(Date.now() + duration)
					}
				}).catch(console.error);
				if (!msg) return message.channel.send("Quelque chose s'est mal passé en envoyant le message :/").catch(console.error);

				msg.edit(msg.embeds[0].setFooter(`${winners} gagnant${winners === 1 ? "" : "s"} | ID: ${parseInt(msg.id.slice(12)).toString(36).toUpperCase()} | Fin du giveaway`))

				msg.react("🎉").catch(console.error);
				const timer = setInterval(() => updateGwaMsg(msg), 10000);
				message.client.giveawayTimers.set(msg.id, timer);

				if (!message.isInteraction) {
					if (message.channel.id === GIVEAWAY_CHANNEL_ID) message.delete().catch(console.error);
					else message.react("✅").catch(console.error);
				} else {
					if (message.channel.id !== GIVEAWAY_CHANNEL_ID) message.channel.send("Giveaway créé").catch(console.error);
				}
				break;
			}
			case "end": {
				const ID = args
					? (args[1] || "").toLowerCase()
					: (options[0].options ? options[0].options[0].value : "").toLowerCase();

				const messages = await channel.messages.fetch({ limit: 100 }).catch(console.error);
				if (!messages) return message.channel.send("Quelque chose s'est mal passé en récupérant les messages :/").catch(console.error);
				const giveaways = messages.filter(msg => msg.author.id === message.client.user.id && msg.embeds.length && msg.embeds[0].author.name.startsWith("Giveaway de") && !msg.embeds[0].description.startsWith("Giveaway terminé !"));

				const msg = ID
					? giveaways.find(m => parseInt(m.id.slice(12)).toString(36) === ID)
					: giveaways.first();
				if (!msg) return message.reply("l'ID est incorrect").catch(console.error);

				msg.edit(msg.embeds[0].setTimestamp(Date.now())).catch(console.error);

				if (!message.isInteraction) {
					if (message.channel.id === GIVEAWAY_CHANNEL_ID) message.delete().catch(console.error);
					else message.react("✅").catch(console.error);
				} else {
					if (message.channel.id !== GIVEAWAY_CHANNEL_ID) message.channel.send("Giveaway terminé").catch(console.error);
				}
				break;
			}
			case "delete": {
				const ID = args
					? (args[1] || "").toLowerCase()
					: (options[0].options ? options[0].options[0].value : "").toLowerCase();

				const messages = await channel.messages.fetch({ limit: 100 }).catch(console.error);
				if (!messages) return message.channel.send("Quelque chose s'est mal passé en récupérant les messages :/").catch(console.error);
				const giveaways = messages.filter(msg => msg.author.id === message.client.user.id && msg.embeds.length && msg.embeds[0].author.name.startsWith("Giveaway de") && !msg.embeds[0].description.startsWith("Giveaway terminé !"));

				const msg = ID
					? giveaways.find(m => parseInt(m.id.slice(12)).toString(36) === ID)
					: giveaways.first();
				if (!msg) return message.reply("l'ID est incorrect").catch(console.error);

				msg.delete().catch(console.error);
				clearInterval(message.client.giveawayTimers.get(msg.id));
				message.client.giveawayTimers.delete(msg.id);

				if (!message.isInteraction) {
					if (message.channel.id === GIVEAWAY_CHANNEL_ID) message.delete().catch(console.error);
					else message.react("✅").catch(console.error);
				} else {
					if (message.channel.id !== GIVEAWAY_CHANNEL_ID) message.channel.send("Giveaway supprimé").catch(console.error);
				}
				break;
			}
			case "reroll": {
				const ID = args
					? (args[1] || "").toLowerCase()
					: (options[0].options ? options[0].options[0].value : "").toLowerCase();

				const messages = await channel.messages.fetch({ limit: 100 }).catch(console.error);
				if (!messages) return message.channel.send("Quelque chose s'est mal passé en récupérant les messages :/").catch(console.error);
				const giveaways = messages.filter(msg => msg.author.id === message.client.user.id && msg.embeds.length && msg.embeds[0].author.name.startsWith("Giveaway de") && msg.embeds[0].description.startsWith("Giveaway terminé !"));

				const msg = ID
					? giveaways.find(m => parseInt(m.id.slice(12)).toString(36) === ID)
					: giveaways.first();
				if (!msg) return message.reply("l'ID est incorrect").catch(console.error);

				updateGwaMsg(msg);

				if (!message.isInteraction) {
					if (message.channel.id === GIVEAWAY_CHANNEL_ID) message.delete().catch(console.error);
					else message.react("✅").catch(console.error);
				} else {
					if (message.channel.id !== GIVEAWAY_CHANNEL_ID) message.channel.send("Nouveau gagnant désigné").catch(console.error);
				}
				break;
			}
			default:
				message.reply("arguments incorrects").catch(console.error);
		}
	}
};

module.exports = command;