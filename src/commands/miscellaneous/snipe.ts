import { CommandData } from "../../structures/commands/Command";
import { ApplicationCommandOptionType, PermissionFlagsBits, PermissionsBitField } from "discord.js";
import Util from "../../Util";

const command: CommandData = {
	name: "snipe",
	aliases: [],
	userPermissions: new PermissionsBitField(),
	botPermissions: new PermissionsBitField([PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AttachFiles]),

	options: [
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "message",
			description: undefined,
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "edit",
			description: undefined,
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "reaction",
			description: undefined,
		},
	],

	run: {
		message: async function (input, args, localizations) {
			const snipedMessage = Util.sniping.deletedMessages.get(input.channel.id);
			if (!snipedMessage) {
				await input.reply(localizations.no_message.format(input.locale));
				return;
			}

			input.reply({
				embeds: [
					{
						author: {
							name: snipedMessage.author.tag,
							icon_url: snipedMessage.author.displayAvatarURL(),
						},
						color: input.guild.members.me.displayColor,
						description: snipedMessage.content,
						image: {
							url: snipedMessage.attachments.size ? `attachment://${snipedMessage.attachments.first().name}` : null,
						},
						footer: {
							text: Util.config.DEFAULT_EMBED_FOOTER_TEXT,
						},
					},
				],
				files: Array.from(snipedMessage.attachments).map((attachment) => attachment[1]),
			});
		},

		edit: async function (input, args, localizations) {
			const snipedMessage = Util.sniping.editedMessages.get(input.channel.id);
			if (!snipedMessage) {
				await input.reply(localizations.no_message.format(input.locale));
				return;
			}

			input.reply({
				embeds: [
					{
						author: {
							name: snipedMessage.author.tag,
							icon_url: snipedMessage.author.displayAvatarURL(),
						},
						color: input.guild.members.me.displayColor,
						description: snipedMessage.content,
						footer: {
							text: Util.config.DEFAULT_EMBED_FOOTER_TEXT,
						},
					},
				],
			});
		},

		reaction: async function (input, args, localizations) {
			const snipedReaction = Util.sniping.messageReactions.get(input.channel.id);
			if (!snipedReaction) {
				await input.reply(localizations.no_reaction.format(input.locale));
				return;
			}

			input.reply({
				embeds: [
					{
						author: {
							name: snipedReaction.reaction.message.author.tag,
							icon_url: snipedReaction.reaction.message.author.displayAvatarURL(),
						},
						thumbnail: {
							url: snipedReaction.reaction.emoji.imageURL(),
						},
						color: input.guild.members.me.displayColor,
						description: snipedReaction.reaction.message.content,
						fields: [
							{
								name: "\u200b",
								value: localizations.description.format(
									input.locale,
									snipedReaction.user.tag,
									snipedReaction.reaction.emoji.toString(),
									snipedReaction.reaction.message.url,
								),
							},
						],
						footer: {
							text: Util.config.DEFAULT_EMBED_FOOTER_TEXT,
							icon_url: snipedReaction.user.displayAvatarURL(),
						},
					},
				],
			});
		},
	},
};

export default command;
