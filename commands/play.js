const command = {
	name: "play",
	description: "Joue une musique dans un salon vocal",
	aliases: [],
	args: 1,
	usage: "<recherche>",
	async execute(message, args) {
		const fs = require("fs");

		if (!message.member.voice.channel) {
			return message.reply("tu n'es pas dans un salon vocal").catch(console.error);
		}
		if (!message.client.voiceConnections || !message.client.voiceConnections[message.guild.id]) {
			const join = require("./join.js");
			try { join.execute(message, args); }
			catch (err) {
				return message.reply("Quelque chose s'est mal passé en rejoignant le salon vocal :/").catch(console.error);
			}
		}

		const audio = fs.createReadStream("./audio/musique.mp3");

		const connection = message.client.voiceConnections[message.guild.id];
		try { connection.play(audio); }
		catch (err) { message.reply("Quelque chose s'est mal passé en jouant la musique :/").catch(console.error); }
	}
};

module.exports = command;