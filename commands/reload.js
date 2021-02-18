const { Message } = require("discord.js");

const command = {
	name: "reload",
	description: "Recharger une commande",
	aliases: ["rl"],
	args: 1,
	usage: "<commande>",
	ownerOnly: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, language, languageCode) => {
		const commandName = args
			? args[0].toLowerCase()
			: options[0].value.toLowerCase();
		const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
		if (!command) return message.reply(`il n'y a pas de commande ayant pour nom ou alias \`${commandName}\``).catch(console.error);
		
		delete require.cache[require.resolve(`./${command.name}.js`)];

		try {
			const newCommand = require(`./${command.name}.js`);
			message.client.commands.set(newCommand.name, newCommand);

			const slashCommand = message.client.slashCommands.get(command.name);
			if (slashCommand) {
				const slashOptions = { name: command.name, description: command.description };
				if (command.slashOptions) slashOptions.options = command.slashOptions;
				await message.client.api.applications(message.client.user.id).guilds("672516066756395031").commands(slashCommand.id).patch({
					data: slashOptions
				}).catch(console.error);
			}

			message.channel.send(`La commande \`${command.name}\` a été rechargée !`);
		} catch (err) {
			console.error(err);
			message.channel.send(`Quelque chose s'est mal passé en rechargeant la commande \`${command.name}\`:\n\`\`\`${err.message}\`\`\``).catch(console.error);
		}
	}
}

module.exports = command;