const command = {
	name: "message",
	description: "Envoie un message dans un salon",
	aliases: ["msg", "m"],
	args: 2,
	usage: "<salon> <texte>",
	perms: ["MANAGE_MESSAGES"],
	async execute(message, args) {
		const channel = message.mentions.channels.first();
		if (!channel) {
			try { message.reply("indique le salon dans lequel je dois envoyer le message"); }
			catch (err) { console.log(err); }
		}
		try { channel.send(args.splice(1).join(" ")); }
		catch (err) {
			console.log(err);
			try { message.channel.send("Quelque chose s'est mal passé en envoyant le message"); }
			catch (err) { console.log(err); }
		}
	}
};

module.exports = command;