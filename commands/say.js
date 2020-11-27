const command = {
	name: "say",
	description: "Fais dire n'importe quoi au bot",
	aliases: [],
	args: 0,
	usage: "<texte>",
	async execute(message, args) {
		try {
			message.channel.send(args.join(" "));
			message.delete();
		} catch (err) { console.log(err); }
	}
};

module.exports = command;