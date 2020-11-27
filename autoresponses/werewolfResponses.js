const command = {
	async execute(message) {	
		if (message.channel.id === "759702367800786964" && !message.author.bot) {
			const petiteFilleChannel = message.client.channels.cache.get("764767902124474378");
			try { petiteFilleChannel.send(message.content); }
			catch (err) { console.log(err); }
		};
	}
};

module.exports = command;