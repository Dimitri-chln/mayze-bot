const { Message } = require("discord.js");

const command = {
	name: "help",
	description: {
		fr: "Obtenir la liste des commandes ou des informations sur une commande spécifique",
		en: "Get all commands or help on one specific command"
	},
	aliases: ["h"],
	args: 0,
	usage: "[<command>]",
	botPerms: ["EMBED_LINKS"],
	category: "help",
	newbiesAllowed: true,
	slashOptions: [
		{
			name: "command",
			description: "A command to get help with",
			type: 3,
			required: false
		}
	],
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options, language, languageCode) => {
		const timeToString = require("../utils/timeToString");
		const { OWNER_ID } = require("../config.json");

		const commands = message.client.commands.filter(cmd =>
			(!cmd.onlyInGuilds || cmd.onlyInGuilds.includes(message.guild.id)) &&
			(message.channel.id === "865997369745080341" ? cmd.newbiesAllowed : true)
		);
		
		const commandName = args
			? (args[0] || "").toLowerCase()
			: (options ? options[0].value : "").toLowerCase();

		if (!commandName) {
			message.channel.send({
				embed: {
					author: {
						name: language.commands_list,
						icon_url: message.client.user.avatarURL()
					},
					color: message.guild.me.displayColor,
					description: commands.filter(cmd => !cmd.ownerOnly && !cmd.category).map(cmd => cmd.name).join(", "),
					fields: splitCategories(Array.from(commands.filter(cmd => !cmd.ownerOnly && cmd.category)).map(e => e[1])).map(category => {
						return { name: category.name.replace(/^./, a => a.toUpperCase()), value: category.commands.map(cmd => cmd.name).join(", "), inline: true };
					}),
					footer: {
						text: "✨ Mayze ✨"
					}
				}
			}).catch(console.error);
		} else {

			const command = commands.get(commandName) || commands.find(c => c.aliases && c.aliases.includes(commandName));
			if (!command) return message.reply(language.invalid_command).catch(console.error);

			let data = language.get(language.name, command.name);
			if (command.aliases.length) data += language.get(language.aliases, command.aliases.join("`, `"));
			if (command.description) data += language.get(language.description, command.description[languageCode] || command.description);
			if (command.usage) data += language.get(language.usage, message.client.prefix + command.name, command.usage);
			if (command.perms) data += language.get(language.perms, command.perms.join("`, `"));
			if (command.ownerOnly || command.allowedUsers) data += language.get(language.allowed, command.ownerOnly ? (command.allowedUsers || []).concat(OWNER_ID).map(u => `<@${u}>`).join(", ") : command.allowedUsers.map(u => `<@${u}>`).join(", "));
			data += language.get(language.cooldown, timeToString(command.cooldown || 2, languageCode));
			
			message.channel.send({
				embed: {
					author: {
						name: language.get(language.title, message.client.prefix + command.name),
						icon_url: message.client.user.avatarURL()
					},
					color: message.guild.me.displayColor,
					description: data,
					footer: {
						text: "✨ Mayze ✨"
					}
				}
			}).catch(console.error);
		}

		function splitCategories(commands) {
			let categories = [];
			let category  = commands[0] ? commands[0].category : null;
			while (category) {
				categories.push({ name: category, commands: commands.filter(cmd => cmd.category === category) });
				commands = commands.filter(cmd => cmd.category !== category);
				category = commands[0] ? commands[0].category : null;
			}
			return categories;
		}
	}
};

module.exports = command;