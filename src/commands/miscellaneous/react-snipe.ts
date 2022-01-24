import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import Translations from "../../types/structures/Translations";
import Util from "../../Util";



const command: Command = {
	name: "react-snipe",
	description: {
		fr: "Afficher la réaction que quelqu'un vient de retirer",
		en: "Show the reaction someone just removed"
	},
	userPermissions: [],
	botPermissions: ["EMBED_LINKS"],

	options: {
		fr: [],
		en: []
	},
	
	run: async (interaction: CommandInteraction, translations: Translations) => {
		const snipedReaction = Util.sniping.messageReactions.get(interaction.channel.id);
		if (!snipedReaction) return interaction.reply({
			content: translations.data.no_reaction(),
			ephemeral: true
		});
		
		interaction.reply({
			embeds: [
				{
					author: {
						name: snipedReaction.reaction.message.author.tag,
						iconURL: snipedReaction.reaction.message.author.displayAvatarURL({ dynamic: true })
					},
					thumbnail: {
						url: snipedReaction.reaction.emoji.url
					},
					color: interaction.guild.me.displayColor,
					description: snipedReaction.reaction.message.content,
					fields: [
						{
							name: "\u200b",
								value: translations.data.description(
								snipedReaction.user.tag,
								snipedReaction.reaction.message.url,
								snipedReaction.reaction.emoji.toString()
							)
						}
					],
					footer: {
						text: "✨ Mayze ✨",
						iconURL: snipedReaction.user.displayAvatarURL({ dynamic: true })
					}
				}
			]
		});
	}
};



export default command;