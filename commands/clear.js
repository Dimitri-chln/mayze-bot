const { Message } = require("discord.js");

const command = {
	name: "clear",
	description: "Supprimer plusieurs messages en même temps",
	aliases: ["clean", "cl"],
	cooldown: 5,
	args: 1,
	usage: "<nombre> [mention/id] [-bot] [-r <regex>]",
	perms: ["MANAGE_MESSAGES"],
	slashOptions: [
		{
			name: "nombre",
			description: "Le nombre de messages à supprimer",
			type: 4,
			required: true
		},
		{
			name: "utilisateur",
			description: "Supprimer uniquement les messages de cet utilisateur",
			type: 6,
			required: false
		},
		{
			name: "regex",
			description: "Supprimer uniquement les messages qui correspondent au regex donné",
			type: 3,
			required: false
		}
	],
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options) => {
		let number = args
			? parseInt(args[0])
			: options[0].value;
		if (isNaN(number) || number <= 0 || number > 100)
			return message.reply("entre un nombre compris entre 1 et 100").catch(console.error);
		if (message.deletable) await message.delete().catch(err => {
			++number;
			console.error(err);
		});

		let messages = await message.channel.messages.fetch({ limit: 100 }).catch(console.error);
		if (!messages) return message.channel.send("Quelque chose s'est mal passé en récupérant les messages :/").catch(console.error);
		
		if (args && args.includes("-bot")) messages = messages.filter(msg => msg.author.bot);
		const user = args
			? message.mentions.users.first()
			: (message.guild.members.cache.get((options.find(o => o.name === "utilisateur") || {}).value) || {}).user;
		if (user) messages = messages.filter(msg => msg.author.id === user.id);
		const regex = args
			? args.includes("-r") ? new RegExp(args[args.lastIndexOf("-r") + 1]) : null
			: new RegExp((options.find(o => o.name === "regex") || {}).value);
		if (regex) messages = messages.filter(msg => regex.test(msg));

		messages = messages.first(number);
		try {
			await message.channel.bulkDelete(messages);
		} catch (err) {
			console.error(err);
			return message.channel.send("Quelque chose s'est mal passé en supprimant les messages :/").catch(console.error);
		}
		const response = messages.length === 0
			? "Aucun message n'a été supprimé"
			: messages.length === 1
				? "1 message a été supprimé"
				: `${messages.length} messages ont été supprimés`;
		const msg = await message.channel.send(response).catch(console.error);
		msg.delete({ timeout: 4000 }).catch(console.error);
	}
};

module.exports = command;