const command = {
	name: "react-snipe",
	description: {
		fr: "Afficher la réaction que quelqu'un vient de retirer",
		en: "Show the reaction someone just removed"
	},
	aliases: ["reactsnipe"],
	args: 0,
	usage: "",
	botPerms: ["EMBED_LINKS"],
	category: "miscellaneous",
	newbiesAllowed: true,
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	run: async (message, args, options, language, languageCode) => {
		const snipedReaction = message.client.removedReactions ? message.client.removedReactions[message.channel.id] : null;
		if (!snipedReaction) return message.reply(language.no_reaction).catch(console.error);
		
		message.channel.send({
			embed: {
				author: {
					name: snipedReaction.author.tag,
					iconURL: snipedReaction.author.displayAvatarURL({ dynamic: true})
                },
                thumbnail: {
                    url: snipedReaction.emoji.url
                },
				color: message.guild.me.displayColor,
                description: snipedReaction.message.content,
                fields: [
                    { name: "\u200b", value: language.get(language.description, snipedReaction.user.tag, snipedReaction.message.url, snipedReaction.emoji) }
                ],
				footer: {
					text: "✨ Mayze ✨",
					iconURL: snipedReaction.user.displayAvatarURL({ dynamic: true })
				}
			}
		}).catch(console.error);
	}
};

module.exports = command;