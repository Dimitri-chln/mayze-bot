const { Message } = require("discord.js");

const command = {
	name: "reaction-roles",
	description: "Gérer les rôles avec réaction",
	aliases: ["rroles"],
	args: 2,
	usage: "create <titre> | add <ID message> <rôle> <emoji> | remove <ID message> <rôle>",
	perms: ["MANAGE_ROLES"],
	botPerms: ["EMBED_LINKS", "ADD_REACTIONS", "MANAGE_ROLES"],
	onlyInGuilds: ["689164798264606784"],
	slashOptions: [
		{
			name: "create",
			description: "Créer un nouveau message vierge",
			type: 1,
			options: [
				{
					name: "titre",
					description: "Le titre du message",
					type: 3,
					required: true
				}
			]
		},
		{
			name: "add",
			description: "Ajouter un nouveau rôle",
			type: 1,
			options: [
				{
					name: "message",
					description: "L'ID du message auquel ajouter le rôle",
					type: 3,
					required: true
				},
				{
					name: "rôle",
					description: "Le rôle à ajouter",
					type: 8,
					required: true
				},
				{
					name: "emoji",
					description: "L'emoji à ajouter avec le rôle",
					type: 3,
					required: true
				}
			]
		},
		{
			name: "remove",
			description: "Retirer un rôle",
			type: 1,
			options: [
				{
					name: "message",
					description: "L'ID du message duquel retirer le rôle",
					type: 3,
					required: true
				},
				{
					name: "rôle",
					description: "Le rôle à retirer",
					type: 8,
					required: true
				}
			]
		}
	],
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, language, languageCode) => {
		const { ROLES_CHANNEL_ID } = require("../config.json");
		const rolesChannel = message.guild.channels.cache.get(ROLES_CHANNEL_ID);
		const subCommand = args
			? args[0].toLowerCase()
			: options[0].name;
		
			switch (subCommand) {
				case "create": {
					const title = args
						? args.slice(1).join(" ")
						: options[0].options[0].value;

					const msg = await rolesChannel.send({
						embed: {
							author: {
								name: title,
								icon_url: message.client.user.avatarURL()
							},
							color: message.guild.me.displayColor,
							description: "*Aucun rôle pour le moment*",
							footer: {
								text: "✨ Mayze ✨"
							}
						}
					}).catch(console.error);
					if (msg) message.reply(`message créé\n**ID:** \`${msg.id}\``).catch(console.error);
					else message.channel.send("Quelque chose s'est mal passé en envoyant le message :/").catch(console.error);
					break;
				}
				case "add": {
					const msgID = args
						? args[1]
						: options[0].options[0].value;
					const msg = await rolesChannel.messages.fetch(msgID);
					if (!msg) return message.reply("l'ID du message est incorrect").catch(console.error);
					const role = args
						? message.guild.roles.cache.find(r => r.id === args[2] || r.name.toLowerCase() === args[2] || r.name.toLowerCase().includes(args[2]))
						: message.guild.roles.cache.get(options[0].options[1].value);
					if (!role) return message.reply("ce rôle n'existe pas").catch(console.error);
					const emoji = args
						? args[3]
						: options[0].options[2].value;
					if (!emoji) return message.reply("ajoute un emoji").catch(console.error);

					const m = await msg.edit(msg.embeds[0].setDescription(`${msg.embeds[0].description.replace("*Aucun rôle pour le moment*", "")}\n${emoji} • ${role}`)).catch(console.error);
					if (!m) return message.channel.send("Quelque chose s'est mal passé en modifiant le message :/").catch(console.error);
					msg.react(emoji).catch(console.error);
					if (!message.isInteraction) message.react("✅").catch(console.error);
					else message.reply("rôle ajouté", { ephemeral: true }).catch(console.error);
					break;
				}
				case "remove": {
					const msgID = args
						? args[1]
						: options[0].options[0].value;
					const msg = await rolesChannel.messages.fetch(msgID);
					if (!msg) return message.reply("l'ID du message est incorrect").catch(console.error);
					const role = args
						? message.guild.roles.cache.find(r => r.id === args[2] || r.name.toLowerCase() === args[2] || r.name.toLowerCase().includes(args[2]))
						: message.guild.roles.cache.get(options[0].options[1].value);
					if (!role) return message.reply("ce rôle n'existe pas").catch(console.error);
					const [ , emoji ] = msg.embeds[0].description.match(new RegExp(`(.*) • ${role}`));

					const m = await msg.edit(msg.embeds[0].setDescription(msg.embeds[0].description.replace(new RegExp(`${emoji} • ${role}\n?`), "") || "*Aucun rôle pour le moment*")).catch(console.error);
					if (!m) return message.channel.send("Quelque chose s'est mal passé en modifiant le message :/").catch(console.error);
					msg.reactions.cache.get(emoji).users.cache.forEach(u => msg.reactions.cache.get(emoji).users.remove(u).catch(console.error));
					if (!message.isInteraction) message.react("✅").catch(console.error);
					else message.reply("rôle retiré", { ephemeral: true }).catch(console.error);
					break;
				}
				default:
					message.reply("arguments incorrects").catch(console.error);
			}
	}
};

module.exports = command;