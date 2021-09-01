const { Message } = require("discord.js");

const command = {
	/**
	 * @param {Message} message 
	 */
	execute: async message => {
		const users = [
			{
				user: await message.client.users.fetch("307815349699608577").catch(console.error),
				regex: /\b(?:dim+(?:itr(?:i|ax))?(?:ouille)?)+\b/i
			},
			{
				user: await message.client.users.fetch("608623753399762964").catch(console.error),
				regex: /\bmila(?:y(?=na))?(?:na)?\b/i
			}
		];
		
		for (const userData of users) {
			if (message.channel.type !== "dm" && !message.author.bot && message.author.id !== userData.user.id && userData.regex.test(message.content) && !message.mentions.users.has(userData.user.id) && message.channel.members.has(userData.user.id)) {
				userData.user.send({
					embed: {
						author: {
							name: message.author.tag,
							icon_url: message.author.displayAvatarURL({ dynamic: true }),
							url: message.url
						},
						title: `#${message.channel.name}`,
						color: message.guild.me.displayColor,
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
	}
};

module.exports = command;