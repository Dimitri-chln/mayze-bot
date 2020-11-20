const command = {
	name: "eval",
	description: "👀",
	aliases: [],
	cooldown: 1,
	args: 1,
	usage: "<expression>",
	ownerOnly: true,
	async execute(message, args) {
		try { eval(args.join(" ").replace(/##/g, "message.channel.send")); }
		catch (err) {
			console.log(err);
			message.channel.send(`__Error:__\`\`\`${err}\`\`\``).catch(console.error);
		};
	}
};

module.exports = command;