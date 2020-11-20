const command = {
	name: "join",
	description: "Fait rejoindre au bot le même salon vocal que toi",
	aliases: [],
	args: 0,
	usage: "",
	async execute(message, args) {
		if (!message.member.voice.channel) {
			return message.reply("tu n'es pas dans un salon vocal").catch(console.error);
		}
		try {
			const connection = await message.member.voice.channel.join();
			if (!message.client.voiceConnections) message.client.voiceConnections = {};
			message.client.voiceConnections[message.guild.id] = connection;
			message.react("✅").catch(console.error);
		} catch (err) {
			console.log(err);
			message.reply("Quelque chose s'est mal passé en rejoignant le salon vocal :/").catch(console.error);
		}
	}
};

module.exports = command;