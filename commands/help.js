const { Message } = require("discord.js");

const command = {
	name: "help",
	description: "Obtenir la liste des commandes ou des informations sur une commande spécifique",
	aliases: ["h"],
	args: 0,
	usage: "[<commande>]",
	slashOptions: [
		{
			name: "commande",
			description: "La commande pour laquelle obtenir des informations",
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

		const commands = message.client.commands.filter(cmd => !cmd.onlyInGuilds || cmd.onlyInGuilds.includes(message.guild.id));
		const { OWNER_ID } = require("../config.json");
		const commandName = args
			? (args[0] || "").toLowerCase()
			: (options ? options[0].value : "").toLowerCase();

		if (!commandName) {
			message.channel.send({
				embed: {
					author: {
						name: "Liste des commandes",
						icon_url: message.client.user.avatarURL()
					},
					color: "#010101",
					description: commands.filter(cmd => !cmd.ownerOnly && !cmd.category).map(cmd => cmd.name).join(", "),
					fields: splitCategories(Array.from(commands.filter(cmd => !cmd.ownerOnly && cmd.category)).map(e => e[1])).map(category => {
						return { name: category.name.replace(/^./, a => a.toUpperCase()), value: category.commands.map(cmd => cmd.name).join(", "), inline: true };
					}),
					footer: {
						text: "✨Mayze✨"
					}
				}
			}).catch(console.error);
		} else {

			const command = commands.get(commandName) || commands.find(c => c.aliases && c.aliases.includes(commandName));
			if (!command) return message.reply("cette commande n'existe pas").catch(console.error);

			let data = `**Nom:** \`${command.name}\``;
			if (command.aliases.length) data += `\n**Aliases:** \`${command.aliases.join("`, `")}\``;
			if (command.description) data += `\n**Description:** ${command.description[language] || command.description}`;
			if (command.usage) data += `\n**Utilisation:** \`${message.client.prefix}${command.name} ${command.usage}\``;
			if (command.perms) data += `\n**Permissions:** \`${command.perms.join("`, `")}\``;
			if (command.ownerOnly || command.allowedUsers) data += `\n**Utilisable par:** ${command.ownerOnly ? (command.allowedUsers || []).concat(OWNER_ID).map(u => `<@${u}>`).join(", ") : command.allowedUsers.map(u => `<@${u}>`).join(", ")}`;
			data += `\n**Cooldown:** ${timeToString(command.cooldown || 2, language, languageCode)})`;
			
			message.channel.send({
				embed: {
					title: "__Message d'aide automatisé__",
					color: "#010101",
					description: data,
					footer: {
						text: "✨Mayze✨"
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