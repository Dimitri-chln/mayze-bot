import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

const command: Command = {
	name: "snipe",
	aliases: [],
	description: {
		fr: "Exposer un message supprimé, une modification ou une réaction retirée sur le salon",
		en: "Expose a deleted message, an edit or a removed reaction in the channel",
	},
	usage: "",
	userPermissions: [],
	botPermissions: ["EMBED_LINKS", "ATTACH_FILES"],

	options: {
		fr: [
			{
				name: "message",
				description: "Exposer un message supprimé sur le salon",
				type: "SUB_COMMAND",
			},
			{
				name: "edit",
				description: "Exposer un message modifié sur le salon",
				type: "SUB_COMMAND",
			},
			{
				name: "reaction",
				description: "Exposer une réaction retirée sur le salon",
				type: "SUB_COMMAND",
			},
		],
		en: [
			{
				name: "message",
				description: "Expose a deleted message in the channel",
				type: "SUB_COMMAND",
			},
			{
				name: "edit",
				description: "Expose an edited message in the channel",
				type: "SUB_COMMAND",
			},
			{
				name: "reaction",
				description: "Expose a removed reaction in the channel",
				type: "SUB_COMMAND",
			},
		],
	},

	runInteraction: async (interaction, translations) => {
		const subCommand = interaction.options.getSubcommand();

		switch (subCommand) {
			case "message": {
				const snipedMessage = Util.sniping.deletedMessages.get(interaction.channel.id);
				if (!snipedMessage) return interaction.followUp(translations.strings.no_message());

				interaction.followUp({
					embeds: [
						{
							author: {
								name: snipedMessage.author.tag,
								iconURL: snipedMessage.author.displayAvatarURL({
									dynamic: true,
								}),
							},
							color: interaction.guild.me.displayColor,
							description: snipedMessage.content,
							image: {
								url: snipedMessage.attachments.size ? `attachment://${snipedMessage.attachments.first().name}` : null,
							},
							footer: {
								text: "✨ Mayze ✨",
							},
						},
					],
					files: Array.from(snipedMessage.attachments).map((attachment) => attachment[1]),
				});
				break;
			}

			case "edit": {
				const snipedMessage = Util.sniping.editedMessages.get(interaction.channel.id);
				if (!snipedMessage) return interaction.followUp(translations.strings.no_message());

				interaction.followUp({
					embeds: [
						{
							author: {
								name: snipedMessage.author.tag,
								iconURL: snipedMessage.author.displayAvatarURL({
									dynamic: true,
								}),
							},
							color: interaction.guild.me.displayColor,
							description: snipedMessage.content,
							footer: {
								text: "✨ Mayze ✨",
							},
						},
					],
				});
				break;
			}

			case "reaction": {
				const snipedReaction = Util.sniping.messageReactions.get(interaction.channel.id);
				if (!snipedReaction) return interaction.followUp(translations.strings.no_reaction());

				interaction.followUp({
					embeds: [
						{
							author: {
								name: snipedReaction.reaction.message.author.tag,
								iconURL: snipedReaction.reaction.message.author.displayAvatarURL({
									dynamic: true,
								}),
							},
							thumbnail: {
								url: snipedReaction.reaction.emoji.url,
							},
							color: interaction.guild.me.displayColor,
							description: snipedReaction.reaction.message.content,
							fields: [
								{
									name: "\u200b",
									value: translations.strings.description(
										snipedReaction.user.tag,
										snipedReaction.reaction.message.url,
										snipedReaction.reaction.emoji.toString(),
									),
								},
							],
							footer: {
								text: "✨ Mayze ✨",
								iconURL: snipedReaction.user.displayAvatarURL({
									dynamic: true,
								}),
							},
						},
					],
				});
				break;
			}
		}
	},
};

export default command;
