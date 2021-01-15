const { Message } = require("discord.js");

const command = {
	name: "dm-link",
	description: "Relier un salon à tes DM pour pouvoir parler à travers le bot",
	aliases: ["dmLink", "link"],
	args: 1,
	usage: "<salon>",
	ownerOnly: true,
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	async execute(message, args, options) {
		const channel = args
			? message.mentions.channels.first()
			: message.client.channels.cache.get(options[0].value);
		if (!channel) return message.reply("entre un salon textuel valide").catch(console.error);
		if (channel.type !== "text") return message.reply("entre un salon textuel valide").catch(console.error);

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
			message.author.send({
				content: `**${msg.author.tag}**: ${msg.content}`,
				embed: msg.embeds[0]
			}).catch(console.error);
		});

		dmCollector.on("collect", async msg => {
			if (msg.content === `${message.client.prefix}stop`) {
				channelCollector.stop();
				dmCollector.stop();
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
				channel.send(msg.content).catch(console.error);
			}
		});
	}
};

module.exports = command;