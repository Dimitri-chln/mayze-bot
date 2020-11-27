const command = {
	async execute(message) {
		if (message.author.bot) return;
		const regex = /https:\/\/(?:cdn\.)?discord(?:app)?\.com\/channels\/(\d{18})\/(\d{18})\/(\d{18})/;
		if (!regex.test(message.content)) return;
		const IDs = message.content.match(regex);
		if (message.guild.id !== IDs[1]) return;
		const channel = message.client.channels.cache.get(IDs[2]);
		var msg;
		try { msg = await channel.messages.fetch(IDs[3]); }
		catch (err) { return console.log(err);	}	
		if (msg.embeds.length) return;
		try {
			message.channel.send({
				embed: {
					author: {
						name: msg.author.tag,
						icon_url: `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png`
					},
					title: `#${channel.name}`,
					color: "#010101",
					description: msg.content,
					fields: [
						{ name: "• Lien", value: `[Aller au message](https://discord.com/channels/${IDs.join("/")})` }
					],
					image: {
						url: (msg.attachments.first() || {}).url
					},
					footer: {
						text: `Cité par ${message.author.username}`
					},
					timestamp: msg.createdTimestamp
				}
			});
		} catch (err) { console.log(err); }	
	}
};

module.exports = command;