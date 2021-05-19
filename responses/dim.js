const { Message } = require("discord.js");

const command = {
	/**
	 * @param {Message} message 
	 */
	execute: async message => {
		const dim = await message.client.users.fetch("307815349699608577").catch(console.error);

		const regex = /\b(?:dim+(?:itr(?:i|ax))?)+\b/i;
		
		if (message.author.id !== dim.id && regex.test(message.content) && !message.mentions.users.has(dim.id)) {
			dim.send({
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