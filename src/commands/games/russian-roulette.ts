import { CommandData } from "../../structures/commands/Command";
import {
	APIEmbed,
	ApplicationCommandOptionType,
	ButtonInteraction,
	ButtonStyle,
	Collection,
	CollectorFilter,
	ComponentType,
	GuildMember,
	PermissionFlagsBits,
	PermissionsBitField,
} from "discord.js";
import Util from "../../Util";

import sleep from "../../utils/misc/sleep";

const command: CommandData = {
	name: "russian-roulette",
	aliases: ["russianroulette", "rr"],
	userPermissions: new PermissionsBitField(),
	botPermissions: new PermissionsBitField([
		PermissionFlagsBits.EmbedLinks,
		PermissionFlagsBits.ModerateMembers,
		PermissionFlagsBits.KickMembers,
	]),
	cooldown: 10,

	options: [],

	run: async function (input, args, localizations) {
		const players: Collection<string, GuildMember> = new Collection();
		players.set(input.user.id, input.member);

		const reply = await input.reply(getMessage());

		const buttonCollector = reply.createMessageComponentCollector({
			componentType: ComponentType.Button,
			idle: 60_000,
		});

		buttonCollector.on("collect", async (buttonInteraction) => {
			const member = buttonInteraction.member as GuildMember;

			switch (buttonInteraction.customId) {
				case "join": {
					if (players.has(buttonInteraction.user.id)) {
						buttonInteraction.reply({
							content: localizations.already_joined.format(input.locale),
							ephemeral: true,
						});
					} else {
						players.set(member.user.id, member);

						input.editReply(getMessage());
						buttonInteraction.reply({
							content: localizations.joined.format(input.locale),
							ephemeral: true,
						});
					}

					break;
				}

				case "start": {
					if (member.user.id !== input.user.id && !member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
						buttonInteraction.reply({
							content: localizations.start_not_allowed.format(input.locale),
							ephemeral: true,
						});
						return;
					}

					if (players.size < 2) {
						buttonInteraction.reply(localizations.not_enough_players.format(input.locale));
						return;
					}

					buttonCollector.stop();

					// Start the game
					const embed: APIEmbed = {
						author: {
							name: localizations.started.format(input.locale),
							icon_url: input.user.displayAvatarURL(),
						},
						color: input.guild.members.me.displayColor,
						description: "...",
						footer: {
							text: Util.config.DEFAULT_EMBED_FOOTER_TEXT,
						},
					};

					const reply = await buttonInteraction.reply({ embeds: [embed] });

					for (let i = 0; i < 5; i++) {
						await sleep(2_000);

						const savedPlayer = players.random();
						players.delete(savedPlayer.user.id);
						embed.description = `**${savedPlayer.user.tag}** ...`;
						reply.edit({ embeds: [embed] }).catch(console.error);

						if (players.size === 1) break;
					}

					await sleep(2_000);
					const deadPlayer = players.random();
					embed.description = localizations.dead.format(input.locale, deadPlayer.user.toString());
					reply.edit({ embeds: [embed] });

					if (deadPlayer.roles.highest.position < input.guild.members.me.roles.highest.position)
						deadPlayer.timeout(60_000, localizations.reason.format(input.locale));

					break;
				}

				case "cancel": {
					if (member.user.id !== input.user.id && !member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
						buttonInteraction.reply({
							content: localizations.cancel_not_allowed.format(input.locale),
							ephemeral: true,
						});
						return;
					}

					buttonCollector.stop();
					buttonInteraction.reply(localizations.cancelled.format(input.locale));
					break;
				}
			}
		});

		buttonCollector.once("end", (collected, reason) => {
			if (reason !== "messageDelete") input.editReply(getMessage(true));
		});

		function getComponents(disabled: boolean = false) {
			const components = [
				{
					type: ComponentType.ActionRow,
					components: [
						{
							type: ComponentType.Button as ComponentType.Button,
							customId: "join",
							label: localizations.join.format(input.locale),
							style: ButtonStyle.Primary as ButtonStyle.Primary,
							disabled: disabled,
						},
						{
							type: ComponentType.Button as ComponentType.Button,
							customId: "start",
							label: localizations.start.format(input.locale),
							emoji: Util.config.EMOJIS.check.data,
							style: ButtonStyle.Success as ButtonStyle.Success,
							disabled: disabled,
						},
						{
							type: ComponentType.Button as ComponentType.Button,
							customId: "cancel",
							label: localizations.cancel.format(input.locale),
							emoji: Util.config.EMOJIS.cross.data,
							style: ButtonStyle.Danger as ButtonStyle.Danger,
							disabled: disabled,
						},
					],
				},
			];

			return components;
		}

		function getMessage(disabled: boolean = false) {
			return {
				embeds: [
					{
						author: {
							name: localizations.title.format(input.locale),
							icon_url: input.user.displayAvatarURL(),
						},
						color: input.guild.members.me.displayColor,
						fields: [
							{
								name: localizations.players.format(input.locale),
								value: `${players.map((player) => player.user.toString()).join(", ")}`,
							},
						],
						footer: {
							text: Util.config.DEFAULT_EMBED_FOOTER_TEXT,
						},
					},
				],
				components: getComponents(disabled),
			};
		}
	},
};

export default command;
