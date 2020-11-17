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
			try { message.reply("mentionne une personne"); }
			catch (err) { console.log(err); }
			return;
		}
		const commandName = args[1].toLowerCase();
		const command = message.client.commands.get(commandName) ||
			message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
		if (!command) {
			try { message.channel.send(`Il n'y a pas de commandes ayant pour nom ou alias \`${commandName}\`, ${message.author}!`); }
			catch (err) { console.log(err); }
			return;
		}
		const timestamps = message.client.cooldowns.get(command.name);
		if (!timestamps) {
			try { message.reply("il n'y a pas de cooldown actif pour cette commande!"); }
			catch (err) { console.log(err); }
			return;
		}
		if (timestamps.has(user.id)) timestamps.delete(user.id);
		try { message.channel.send(`Le cooldown de la commande \`${command.name}\` a été réinitialisé pour <@${user.id}>`); }
		catch (err) { console.log(err); }
	}
};

module.exports = command;