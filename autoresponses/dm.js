const command = {
	async execute(message) {
		if (message.channel.type === "dm" &&message.author.id !== message.client.user.id) {
			var msg = message.content;
			if (message.attachments) {
				var attachments = message.attachments.array();
				var urls = attachments.map(attachment => attachment.url).join("\n");
				msg = `${msg}\n${urls}`;
			}
			const DMGuild = message.client.guilds.cache.get("744291144946417755");
			const category = DMGuild.channels.cache.get("744292272300097549");
			var channel = DMGuild.channels.cache.find(c => c.topic === message.author.id);
			if (!channel) {
				try {
					channel = await DMGuild.channels.create(message.author.username, "text");
					channel.setParent(category.id);
					channel.setTopic(message.author.id);
					channel.send(msg);
				}
				catch (err) { console.log(err); }					
			} else {
				try {
					channel.setName(message.author.username);
					channel.send(msg);
				} catch (err) { console.log(err); }	
			}
		} else {
			if (message.channel.parentID === "744292272300097549" && !message.author.bot) {
				var msg = message.content;
				if (message.attachments) {
					var attachments = message.attachments.array();
					var urls = attachments.map(attachment => attachment.url).join("\n");
					msg = `${msg}\n${urls}`;
				}
				try {
					const user = message.client.users.cache.get(message.channel.topic) || await message.client.users.fetch(message.channel.topic);
					user.send(msg);
				} catch (err) { console.log(err); }	
			}
		}
	}
};

module.exports = command;