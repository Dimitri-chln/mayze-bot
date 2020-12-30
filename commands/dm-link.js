const { Message } = require("discord.js");

const command = {
	name: "dm-link",
	desription: "Relie un salon à tes DM pour pouvoir parler à travers le bot",
	aliases: ["dmLink", "link"],
	args: 1,
	usage: "<salon>",
	ownerOnly: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} _args 
	 */
	async execute(message, _args) {
		const channel = message.mentions.channels.first();
		if (!channel) return message.reply("mentionne un salon").catch(console.error);
		const { dmChannel } = message.author;
		
		message.author.send({
			embed: {
				author: {
					name: message.author.tag,
					icon_url: message.author.avatarURL({ dynamic: true })
				},
				title: `Début de la conversation avec #${ channel.name }`,
				color: "#010101",
				description: `Tu vas recevoir tous les messages du salon ici. Envoie un message pour qu'il soit envoyé dans ${ channel }\n\n> Tu peux arrêter à tout moment en envoyant ${ message.client.prefix }stop`,
				footer: {
					text: "✨ Mayze ✨"
				}
			}
		}).catch(console.error);

		const channelCollector = channel.createMessageCollector(m => m.author.id !== message.client.user.id);
		const dmCollector = dmChannel.createMessageCollector(m => !m.author.bot);
		message.react("✅").catch(console.error);

		channelCollector.on("collect", async msg => {
			message.author.send({
				content: `**${ msg.author.tag }**: ${ msg.content }`,
				embed: msg.embeds[0]
			}).catch(console.error);
		});

		dmCollector.on("collect", async msg => {
			if (msg.content === `${ message.client.prefix }stop`) {
				channelCollector.stop();
				dmCollector.stop();
				dmChannel.send({
					embed: {
						author: {
							name: message.author.tag,
							icon_url: message.author.avatarURL({ dynamic: true })
						},
						title: `Fin de la conversation avec #${ channel.name }`,
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