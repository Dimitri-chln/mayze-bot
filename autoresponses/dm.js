const { Message } = require("discord.js");

const command = {
	/**
	 * @param {Message} message 
	 */
	async execute(message) {
		const DMGuild = message.client.guilds.cache.get("744291144946417755");
		if(!DMGuild) return;
		const DMcategory = DMGuild.channels.cache.get("744292272300097549");
		if (message.channel.type === "dm" && message.author.id !== message.client.user.id) {
			const msg = `${message.content}\n${message.attachments.map(attachment => attachment.url).join("\n")}`;
			let channel = DMGuild.channels.cache.find(c => c.topic === message.author.id);
			if (!channel) {
				channel = await DMGuild.channels.create(message.author.username, "text").catch(console.error);
				channel.setParent(DMcategory.id).catch(console.error);
				channel.setTopic(message.author.id).catch(console.error);
			} else {
				channel.setName(message.author.username).catch(console.error);
			}
			channel.send(msg);

		} else if (message.channel.parentID === DMcategory.id && !message.author.bot) {
			const msg = `${message.content}\n${message.attachments.map(attachment => attachment.url).join("\n")}`;
			const user = message.client.users.cache.get(message.channel.topic) || await message.client.users.fetch(message.channel.topic).catch(console.error);
			user.send(msg).catch(console.error);
		}
	}
};

module.exports = command;