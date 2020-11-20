const command = {
	name: "play",
	description: "Joue une musique dans un salon vocal",
	aliases: [],
	args: 1,
	usage: "<recherche>",
	async execute(message, args) {
		const fs = require("fs");

		if (!message.member.voice.channel) {
			try { message.reply("tu n'es pas dans un salon vocal"); }
			catch (err) { console.log(err); }
			return;
		}
		if (!message.client.voiceConnections || !message.client.voiceConnections[message.guild.id]) {
			const join = require("./join.js");
			try { join.execute(message, args); }
			catch (err) {
				try { message.reply("Quelque chose s'est mal passé en rejoignant le salon vocal :/"); }
				catch (err) { console.log(err); }
				return;
			}
		}

		const audio = fs.createReadStream("./audio/musique.mp3");

		const connection = message.client.voiceConnections[message.guild.id];
		try { connection.play(audio); }
		catch (err) { message.reply("Quelque chose s'est mal passé en jouant la musique :/"); }
	}
};

module.exports = command;