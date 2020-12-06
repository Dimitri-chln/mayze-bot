const command = {
	name: "help",
	description: "Obtiens la liste complète des commandes ou des informations sur une commande spécifique",
	aliases: ["h"],
	args: 0,
	usage: "[commande]",
	async execute(message, args) {
		const prefix = require("../config.json").prefix[message.client.user.id];
		const commands = message.client.commands;

		if (!args.length) {
			const data = commands.filter(cmd => !cmd.ownerOnly).map(cmd => cmd.name).join(", ");
			try {
				message.channel.send({
					embed: {
						author: {
							name: "Liste des commandes",
							icon_url: message.client.user.avatarURL()
						},
						color: "#010101",
						description: data,
						footer: {
							text: "✨Mayze✨"
						}
					}
				})
			} catch (err) {
				console.log(err);
				message.reply("je n'ai pas pu te DM... As-tu désactivé les messages privés?").catch(console.error);
			}
		} else {
			const name = args[0].toLowerCase();
			const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
			if (!command) {
				message.reply("cette commande n'existe pas!").catch(console.error);
			};
			var data = `**Nom:** \`${command.name}\``;
			if (command.aliases.length) {
				data = data + `\n**Aliases:** \`${command.aliases.join("`, `")}\``;
			};
			if (command.description) {
				data = data + `\n**Description:** ${command.description}`;
			};
			if (command.usage) {
				data = data + `\n**Utilisation:** \`${prefix}${command.name} ${command.usage}\``;
			};
			if (command.perms) {
				data = data + `\n**Permissions:** \`${command.perms.join("`, `")}\``;
			};
			if (command.ownerOnly) {
				data = data + `\nCette commande n'est utilisable que par le propriétaire du bot`;
			};
			data = data + `\n**Cooldown:** ${command.cooldown || 2} seconde(s)`;
			try {
				message.channel.send({
					embed: {
						title: "__Message d'aide automatisé__",
						color: "#010101",
						description: data,
						footer: {
							text: "✨Mayze✨"
						}
					}
				});
			} catch (err) { console.log(err); }
		}
	}
};

module.exports = command;