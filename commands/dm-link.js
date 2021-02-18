const { Message } = require("discord.js");

const command = {
	name: "dm-link",
	description: "Relier un salon à tes DM pour pouvoir parler à travers le bot",
	aliases: ["link"],
	args: 1,
	usage: "<salon> [<utilisateur>]",
	ownerOnly: true,
	allowedUsers: ["394633964138135563"],
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options, language) => {
		const channel = args
			? message.mentions.channels.first()
			: message.client.channels.cache.get(options[0].value);
		if (!channel) return message.reply("entre un salon textuel valide").catch(console.error);
		if (channel.type !== "text") return message.reply("entre un salon textuel valide").catch(console.error);
		const user = args
			? message.mentions.users.first() || args[1] ? (message.client.findMember(message.guild, args[1]) || {}).user : null || message.author
			: message.client.users.cache.get(options[1] ? options[1].value : null) || message.author;

		const loadingMsg = await message.channel.send("Création d'un webhook...").catch(console.error);
		const webhook = await channel.createWebhook(`DM-link de ${message.author.tag}`, { avatar: message.client.user.avatarURL({ size: 4096 }) }).catch(console.error);
		if (!webhook) return loadingMsg.edit("Quelque chose s'est mal passé en créant le webhook :/").catch(console.error);

		const { "channel": dmChannel } = await message.author.send({
			embed: {
				author: {
					name: message.author.tag,
					icon_url: message.author.avatarURL({ dynamic: true })
				},
				title: `Début de la conversation avec #${channel.name}`,
				color: "#010101",
				description: `Tu vas recevoir tous les messages du salon ici. Envoie un message pour qu'il soit envoyé dans ${channel}\n\n> Tu peux arrêter à tout moment en envoyant ${message.client.prefix}stop`,
				footer: {
					text: "✨ Mayze ✨"
				}
			}
		}).catch(console.error);

		const channelCollector = channel.createMessageCollector(m => m.author.id !== message.client.user.id);
		const dmCollector = dmChannel.createMessageCollector(m => !m.author.bot);
		if (message.deletable) message.react("✅").catch(console.error);

		channelCollector.on("collect", async msg => {
			if (msg.webhookID) return;
			message.author.send({
				content: `**${msg.author.tag}**: ${msg.content}`,
				embed: msg.embeds[0]
			}).catch(console.error);
		});

		dmCollector.on("collect", async msg => {
			if (msg.content.toLowerCase() === `${message.client.prefix}stop`) {
				channelCollector.stop();
				dmCollector.stop();
				webhook.delete().catch(console.error);
				dmChannel.send({
					embed: {
						author: {
							name: message.author.tag,
							icon_url: message.author.avatarURL({ dynamic: true })
						},
						title: `Fin de la conversation avec #${channel.name}`,
						color: "#010101",
						footer: {
							text: "✨ Mayze ✨"
						}
					}
				}).catch(console.error);
			} else {
				webhook.send(msg.content, { avatarURL: user.avatarURL(), username: message.guild.member(user).displayName }).catch(console.error);
			}
		});
	}
};

module.exports = command;