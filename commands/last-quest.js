const { Message } = require("discord.js");

const command = {
	name: "last-quest",
	description: "Modifier le dernier message de vote pour les quêtes WWO",
	aliases: ["lastquest", "lq"],
	cooldown: 5,
	args: 1,
	usage: "[-image (+image)] [-everyone|-members] [-single|-multiple]",
	onlyInGuilds: ["689164798264606784"],
	perms: ["ADMINISTRATOR"],
	category: "wolvesville",
	disableSlash: true,
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options, language, languageCode) => {
		if (!message.member.roles.cache.some(r => ["696751614177837056", "696751852267765872"].includes(r.id))) 
			return message.reply("tu n'es ni chef ni sous-chef du clan").catch(console.error);

		const questChannel = message.client.channels.cache.get("689385764219387905");

		const messages = await questChannel.messages.fetch({ limit: 30 });
		const quests = messages.filter(m => m.embeds.length && m.author.id === message.client.user.id);
		const quest = quests.first();

		let imageURL = (quest.embeds[0].image || {}).url;
		if (args.includes("-image") && message.attachments.size) imageURL = message.attachments.first().url;
		let footerFlags = quest.embeds[0].footer.text.split(" - ");
		if (args.includes("-everyone")) footerFlags[0] = "Tout le monde";
		if (args.includes("-members")) footerFlags[0] = "Membres uniquement";
		if (args.includes("-single")) footerFlags[1] = "Un seul vote";
		if (args.includes("-multiple")) footerFlags[1] = "Plusieurs votes";

		quest.edit({
			content: quest.content,
				embed: {
				title: "Nouvelles quêtes disponibles",
				color: message.guild.me.displayColor,
				image: {
					url: imageURL
				},
				footer: {
					text: footerFlags.join(" - ")
					}
			}
		}).then(() => message.react("✅").catch(console.error)).catch(console.error);
	}
}

module.exports = command;