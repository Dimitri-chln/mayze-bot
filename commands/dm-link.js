const { Message } = require("discord.js");

const command = {
	name: "dm-link",
	description: {
		fr: "Relier un salon à tes DM pour pouvoir parler à travers le bot",
		en: "Link a channel to your DMs so you can talk through the bot"
	},
	aliases: ["link"],
	args: 1,
	usage: "<channel> [<user>]",
	ownerOnly: true,
	allowedUsers: ["394633964138135563", "463358584583880704"],
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options, language, languageCode) => {
		const channel = args
			? message.mentions.channels.first()
			: message.client.channels.cache.get(options[0].value);
		if (!channel || channel.type !== "text") return message.reply(language.invalid_channel).catch(console.error);
		const user = args
			? message.mentions.users.first() || args[1] ? (message.client.findMember(message.guild, args[1]) || {}).user : null || message.author
			: message.client.users.cache.get(options[1] ? options[1].value : null) || message.author;

		const loadingMsg = await message.channel.send(language.creating_webhook).catch(console.error);
		const webhook = await channel.createWebhook(`${message.author.tag}'s *dm-link`, { avatar: message.client.user.avatarURL({ size: 4096 }) }).catch(console.error);
		if (webhook) loadingMsg.delete().catch(console.error);
		else return loadingMsg.edit(language.errors.webhook_create).catch(console.error);

		const { "channel": dmChannel } = (await message.author.send({
			embed: {
				author: {
					name: message.author.tag,
					icon_url: message.author.avatarURL({ dynamic: true })
				},
				title: language.get(language.title, channel.name),
				color: message.guild.me.displayColor,
				description: language.get(language.description, channel, message.client.prefix),
				footer: {
					text: "✨ Mayze ✨"
				}
			}
		}).catch(console.error));

		if (!dmChannel) return message.channel.send(language.errors.dm_disabled).catch(console.error);

		const channelCollector = channel.createMessageCollector(m => m.webhookID !== webhook.id);
		const dmCollector = dmChannel.createMessageCollector(m => !m.author.bot);
		if (message.deletable) message.react("✅").catch(console.error);

		channelCollector.on("collect", async msg => {
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
						title: language.get(language.end, channel.name),
						color: message.guild.me.displayColor,
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