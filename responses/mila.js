const { Message } = require("discord.js");

const command = {
	/**
	 * @param {Message} message 
	 */
	execute: async message => {
		const mila = await message.client.users.fetch("608623753399762964").catch(console.error);

		const regex = /\bmila(?:y(?=na))?(?:na)?\b/i;
		
		if (message.author.id !== mila.id && regex.test(message.content) && !message.mentions.users.has(mila.id)) {
			mila.send({
				embed: {
					author: {
						name: message.author.tag,
						icon_url: message.author.avatarURL({ dynamic: true }),
						url: message.url
					},
					title: `#${message.channel.name}`,
					color: 65793,
					description: message.content,
					image: {
						url: message.attachments.size ? message.attachments.first().url : null
					},
					footer: {
						text: "✨ Mayze ✨"
					}
				}
			}).catch(console.error);
		}
	}
};

module.exports = command;