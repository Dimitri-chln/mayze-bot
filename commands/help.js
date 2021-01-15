const { Message } = require("discord.js");

const command = {
	name: "help",
	description: "Obtenir la liste des commandes ou des informations sur une commande spécifique",
	aliases: ["h"],
	args: 0,
	usage: "[commande]",
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
	async execute(message, args, options) {
		const { commands } = message.client;
		const commandName = args
			? (args[0] || "").toLowerCase()
			: (options[0].value || "").toLowerCase();

		if (!commandName) {
			message.channel.send({
				embed: {
					author: {
						name: "Liste des commandes",
						icon_url: message.client.user.avatarURL()
					},
					color: "#010101",
					description: commands.filter(cmd => !cmd.ownerOnly).map(cmd => cmd.name).join(", "),
					footer: {
						text: "✨Mayze✨"
					}
				}
			}).catch(console.error);
		} else {
			const command = commands.get(commandName) || commands.find(c => c.aliases && c.aliases.includes(commandName));
			if (!command) message.reply("cette commande n'existe pas").catch(console.error);
			let data = `**Nom:** \`${command.name}\``;
			if (command.aliases.length) data += `\n**Aliases:** \`${command.aliases.join("`, `")}\``;
			if (command.description) data += `\n**Description:** ${command.description}`;
			if (command.usage) data += `\n**Utilisation:** \`${message.client.prefix}${command.name} ${command.usage}\``;
			if (command.perms) data += `\n**Permissions:** \`${command.perms.join("`, `")}\``;
			if (command.ownerOnly) data += `\nCette commande n'est utilisable que par le propriétaire du bot`;
			data += `\n**Cooldown:** ${command.cooldown || 2} seconde(s)`;
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
	}
};

module.exports = command;