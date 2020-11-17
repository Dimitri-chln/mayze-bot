const command = {
	name: "clear",
	description: "Supprime plusieurs messages en même temps",
	aliases: ["clean", "cl"],
	cooldown: 5,
	args: 1,
	usage: "<nombre> [mention/id] [-bot] [-r <regex>]",
	perms: ["MANAGE_MESSAGES"],
	async execute(message, args) {
		const number = parseInt(args[0], 10);
		if (isNaN(number) || number <= 0 || number > 100) {
			return message.reply("le premier argument doit être un nombre entier compris entre 1 et 100!");
		}
		try { await message.delete(); }
		catch (err) {
			number ++;
			console.log(err);
		}

		var messages;
		try { messages = await message.channel.messages.fetch({ limit: 100 }); }
		catch (err) {
			console.log(err);
			try { message.reply("quelque chose s'est mal passé en récupérant les messages :/"); }
			catch (err) { console.log(err); }
			return;
		}
		
		if (message.mentions.users.size) {
			const user = message.mentions.users.first();
			messages = messages.filter(msg => msg.author.id === user.id);
		}
		if (args.includes("-bot")) {
			messages = messages.filter(msg => msg.author.bot);
		}
		if (args.includes("-r")) {
			const regex = new RegExp(args[args.lastIndexOf("-r") + 1] || ".", "i");
			messages = messages.filter(msg => regex.test(msg));
		}

		messages = messages.first(number);
		try { await message.channel.bulkDelete(messages); }
		catch (err) {
			console.log(err);
			try { message.reply("quelque chose s'est mal passé en supprimant les messages :/"); }
			catch (err) { console.log(err); }
			return;
		}
		var response = `${messages.length} messages ont été supprimés`;
		if (messages.length === 1) response = "1 message a été supprimé";
		if (messages.length === 0) response = "Aucun message n'a été supprimé";
		try {
			const msg = await message.channel.send(response);
			msg.delete({ timeout: 4000 });
		} catch (err) { console.log(err); }
	}
};

module.exports = command;