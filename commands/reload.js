const { Message } = require("discord.js");

const command = {
	name: "reload",
	description: "Recharge une commande",
	aliases: "rl",
	args: 1,
	usage: "<commande>",
	ownerOnly: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 */
	async execute(message, args) {
		const commandName = args[0].toLowerCase();
		const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) return message.reply(`Il n'y a pas de commande ayant pour nom ou alias \`${commandName}\``).catch(console.error);
		
		delete require.cache[require.resolve(`./${command.name}.js`)];

		try {
			const newCommand = require(`./${command.name}.js`);
			message.client.commands.set(newCommand.name, newCommand);
			message.channel.send(`La commande \`${command.name}\` a été rechargée !`);
		} catch (err) {
			console.error(err);
			message.channel.send(`Quelque chose s'est mal passé en rechargeant la commande \`${command.name}\`:\n\`\`\`${err.message}\`\`\``).catch(console.error);
		}
	}
}

module.exports = command;