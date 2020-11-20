const command = {
	name: "reset-cooldown",
	description: "Réinitialise le cooldown d'une commande pour une personne",
	aliases: ["resetCooldown","resetcd", "rcd"],
	args: 2,
	usage: "<mention/id> <commande>",
	ownerOnly: true,
	async execute(message, args) {
		const user = message.mentions.users.first();
		if (!user) {
			return message.reply("mentionne une personne").catch(console.error);
		}
		const commandName = args[1].toLowerCase();
		const command = message.client.commands.get(commandName) ||
			message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
		if (!command) {
			return message.channel.send(`Il n'y a pas de commandes ayant pour nom ou alias \`${commandName}\`, ${message.author}!`).catch(console.error);
		}
		const timestamps = message.client.cooldowns.get(command.name);
		if (!timestamps) {
			return message.reply("il n'y a pas de cooldown actif pour cette commande!").catch(console.error);
		}
		if (timestamps.has(user.id)) timestamps.delete(user.id);
		message.channel.send(`Le cooldown de la commande \`${command.name}\` a été réinitialisé pour <@${user.id}>`).catch(console.error);
	}
};

module.exports = command;