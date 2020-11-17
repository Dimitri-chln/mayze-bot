const command = {
	name: "mass-ping",
	description: "Ping une personne en boucle",
	aliases: ["massping"],
	args: 1,
	usage: "<mention> [nombre]",
	perms: ["MANAGE_MESSAGES"],
	async execute(message, args) {
		const user = message.mentions.users.first();
		const n = parseInt(args[1], 10) || 10;
		message.delete();
		if (isNaN(n) || n < 0 || n > 100) {
			try { message.reply("le nombre doit être compris entre 0 et 100"); }
			catch (err) { console.log(err); }
		}
		for (i = 0; i < n; i++) {
			try {
				const msg = await message.channel.send(`${user}`);
				msg.delete();
			}
			catch (err) { console.log(err); }
		};
	}
};

module.exports = command;