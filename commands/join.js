const command = {
	name: "join",
	description: "Fait rejoindre au bot le même salon vocal que toi",
	aliases: [],
	args: 0,
	usage: "",
	async execute(message, args) {
		if (!message.member.voice.channel) {
			try { message.reply("tu n'es pas dans un salon vocal"); }
			catch (err) { console.log(err); }
			return;
		}
		try {
			const connection = await message.member.voice.channel.join();
			if (!message.client.voiceConnections) message.client.voiceConnections = {};
			message.client.voiceConnections[message.guild.id] = connection;
			try { message.react("✅"); }
			catch (err) { console.log(err); }
		} catch (err) {
			console.log(err);
			try { message.reply("Quelque chose s'est mal passé en rejoignant le salon vocal :/"); }
			catch (err) { console.log(err); }
		}
	}
};

module.exports = command;