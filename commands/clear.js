const { Message } = require("discord.js");

const command = {
	name: "clear",
	description: {
		fr: "Supprimer des messages du salon actuel",
		en: "Delete messages from the current channel"
	},
	aliases: ["clean", "cl"],
	cooldown: 5,
	args: 1,
	usage: "<number> [<user>] [-bot] [-r <regex>]",
	perms: ["MANAGE_MESSAGES"],
	slashOptions: [
		{
			name: "number",
			description: "The number of messages to delete",
			type: 4,
			required: true
		},
		{
			name: "user",
			description: "Delete only messages from this user",
			type: 6,
			required: false
		},
		{
			name: "regex",
			description: "Delete only messages matching this regex",
			type: 3,
			required: false
		}
	],
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, languages, language) => {
		let number = args
			? parseInt(args[0])
			: options[0].value;
		if (isNaN(number) || number <= 0 || number > 100)
			return message.reply(languages.invalid_number[language]).catch(console.error);

		if (message.deletable) await message.delete().catch(err => {
			++number;
			console.error(err);
		});

		let messages = await message.channel.messages.fetch({ limit: 100 }).catch(console.error);
		if (!messages) return message.channel.send(languages.error_fetching_msg[language]).catch(console.error);
		
		if (args && args.includes("-bot")) messages = messages.filter(msg => msg.author.bot);

		const user = args
			? message.mentions.users.first()
			: (message.guild.members.cache.get((options.find(o => o.name === "user") || {}).value) || {}).user;
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
			return message.channel.send(languages.error_deleting_msg[language]).catch(console.error);
		}

		const msg = await message.channel.send(languages.get(languages.deleted[language], messages.length)).catch(console.error);
		msg.delete({ timeout: 4000 }).catch(console.error);
	}
};

module.exports = command;