const { Message } = require("discord.js");

const command = {
	/**
	 * @param {Message} message 
	 */
	async execute(message) {
		if (message.author.bot) return;
		const regex = /https:\/\/(?:cdn\.)?discord(?:app)?\.com\/channels\/(\d{18})\/(\d{18})\/(\d{18})/;
		if (!regex.test(message.content)) return;
		
		const [ guildID, channelID, messageID ] = message.content.match(regex);
		if (message.guild.id !== guildID) return;
		const channel = message.client.channels.cache.get(channelID);
		const msg = await channel.messages.fetch(messageID).catch(console.error);
		if (msg.embeds.length) return;

		message.channel.send({
			embed: {
				author: {
					name: msg.author.tag,
					icon_url: msg.author.avatarURL({ dynamic: true })
				},
				title: `#${channel.name}`,
				color: "#010101",
				description: msg.content,
				fields: [
					{ name: "• Lien", value: `[Aller au message](${msg.url})})` }
				],
				image: {
					url: (msg.attachments.first() || {}).url
				},
				footer: {
					text: `Cité par ${message.author.username}`
				},
				timestamp: msg.createdTimestamp
			}
		}).catch(console.error);
	}
};

module.exports = command;