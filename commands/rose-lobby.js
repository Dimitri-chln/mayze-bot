const { Message, Collection, TextChannel } = require("discord.js");

const command = {
	name: "rose-lobby",
	description: "Ajouter une réaction au message d'annonce de la game de roses",
	aliases: ["rose"],
	args: 1,
	usage: "react [<ID message>] | end",
	onlyInGuilds: ["689164798264606784"],
	disableSlash: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, language, languageCode) => {
		/**@type {TextChannel} */
		const channel = message.guild.channels.cache.get("817365433509740554");
		if (message.channel.id !== channel.id) return;

		const subCommand = args[0].toLowerCase();

		switch (subCommand) {
			case "react":
				await message.delete();
				const msg = args[1]
					? (await channel.messages.fetch(args[1]).catch(console.error))
					: (await channel.messages.fetch({ limit: 1 })).first();
				if (!msg) return message.reply("ID invalide")
					.then(m => m.delete({ timeout: 4000 }).catch(console.error))
					.catch(console.error);
				
				msg.react("833620353133707264").catch(console.error);
				break;
			case "end":
				message.channel.startTyping(1);
				const msgs = await channel.messages.fetch({ limit: 100 }).catch(console.error);
				if (msgs) await Promise.all(msgs.filter(m => m.reactions.cache.has("833620353133707264"))
					.map(async m => await m.reactions.cache.get("833620353133707264").remove().catch(console.error))
				);

				await Promise.all(message.guild.members.cache.filter(m => m.roles.cache.has("833620668066693140"))
					.map(async member => await member.roles.remove("833620668066693140").catch(console.error))
				);

				message.channel.stopTyping();
				message.channel.send("Game de roses terminée. Tous les rôles ont été retirés").catch(console.error);
				break;
			default:
				message.reply("arguments incorrects").catch(console.error);
		}

	}
};

module.exports = command;