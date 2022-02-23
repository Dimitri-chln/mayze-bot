import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

import { ButtonInteraction, CollectorFilter } from "discord.js";

const command: Command = {
	name: "role-all",
	aliases: [],
	description: {
		fr: "Donner ou retirer un rôle à tous les membres",
		en: "Give or remove a role to all members",
	},
	usage: "",
	cooldown: 10,

	userPermissions: ["MANAGE_ROLES"],
	botPermissions: ["MANAGE_ROLES"],

	options: {
		fr: [
			{
				name: "give",
				description: "Donner un rôle à tous les membres",
				type: "SUB_COMMAND",
				options: [
					{
						name: "role",
						description: "Le rôle à donner",
						type: "ROLE",
						required: true,
					},
					{
						name: "option",
						description: "Options pour donner le rôle",
						type: "STRING",
						required: false,
						choices: [
							{
								name: "Bots uniquement",
								value: "bot",
							},
							{
								name: "Utilisateurs humains uniquement",
								value: "human",
							},
						],
					},
				],
			},
			{
				name: "remove",
				description: "Retirer un rôle de tous les membres",
				type: "SUB_COMMAND",
				options: [
					{
						name: "role",
						description: "Le rôle à retirer",
						type: "ROLE",
						required: true,
					},
					{
						name: "option",
						description: "Options pour retirer le rôle",
						type: "STRING",
						required: false,
						choices: [
							{
								name: "Bots uniquement",
								value: "bot",
							},
							{
								name: "Utilisateurs humains uniquement",
								value: "human",
							},
						],
					},
				],
			},
		],
		en: [
			{
				name: "give",
				description: "Give a role to all members",
				type: "SUB_COMMAND",
				options: [
					{
						name: "role",
						description: "The role to give",
						type: "ROLE",
						required: true,
					},
					{
						name: "option",
						description: "Options for giving the role",
						type: "STRING",
						required: false,
						choices: [
							{
								name: "Bots only",
								value: "bot",
							},
							{
								name: "Human users only",
								value: "human",
							},
						],
					},
				],
			},
			{
				name: "remove",
				description: "Remove a role from all members",
				type: "SUB_COMMAND",
				options: [
					{
						name: "role",
						description: "The role to remove",
						type: "ROLE",
						required: true,
					},
					{
						name: "option",
						description: "Options for removing the role",
						type: "STRING",
						required: false,
						choices: [
							{
								name: "Bots only",
								value: "bot",
							},
							{
								name: "Human users only",
								value: "human",
							},
						],
					},
				],
			},
		],
	},

	runInteraction: async (interaction, translations) => {
		const subCommand = interaction.options.getSubcommand();
		const role = interaction.options.getRole("role", true);
		const option: "bot" | "human" | "all" =
			(interaction.options.getString("option", false) as "bot" | "human") ?? "all";

		let members = interaction.guild.members.cache;

		if (option === "bot") members = members.filter((m) => m.user.bot);
		if (option === "human") members = members.filter((m) => !m.user.bot);

		let errors = 0;

		const reply = (await interaction.followUp({
			content: translations.strings.confirmation(
				subCommand === "give",
				role.name,
				members.size.toString(),
				members.size > 1,
			),
			components: [
				{
					type: "ACTION_ROW",
					components: [
						{
							type: "BUTTON",
							customId: "confirm",
							emoji: Util.config.EMOJIS.check.data,
							style: "SUCCESS",
						},
						{
							type: "BUTTON",
							customId: "cancel",
							emoji: Util.config.EMOJIS.cross.data,
							style: "DANGER",
						},
					],
				},
			],
		})) as Message;

		const filter: CollectorFilter<[ButtonInteraction]> = (buttonInteraction) =>
			buttonInteraction.user.id === interaction.user.id;

		try {
			const buttonInteraction = await reply.awaitMessageComponent({
				filter,
				componentType: "BUTTON",
				time: 120_000,
			});

			switch (buttonInteraction.customId) {
				case "confirm": {
					buttonInteraction.update({
						content: translations.strings.updating(
							members.size.toString(),
							members.size > 1,
						),
						components: [
							{
								type: "ACTION_ROW",
								components: [
									{
										type: "BUTTON",
										customId: "confirm",
										emoji: Util.config.EMOJIS.check.data,
										style: "SUCCESS",
										disabled: true,
									},
									{
										type: "BUTTON",
										customId: "cancel",
										emoji: Util.config.EMOJIS.cross.data,
										style: "DANGER",
										disabled: true,
									},
								],
							},
						],
					});

					switch (subCommand) {
						case "give":
							members = members.filter((m) => !m.roles.cache.has(role.id));

							await Promise.all(
								members.map(async (member) => {
									await member.roles.add(role.id).catch((err) => {
										++errors;
										console.error(err);
									});
								}),
							);
							break;

						case "remove":
							members = members.filter((m) => m.roles.cache.has(role.id));

							await Promise.all(
								members.map(async (member) => {
									await member.roles.remove(role.id).catch((err) => {
										++errors;
										console.error(err);
									});
								}),
							);
							break;
					}

					interaction.editReply(
						translations.strings.updated(
							members.size - errors === 0,
							members.size - errors === 1,
							members.size - errors > 1,
							(members.size - errors).toString(),
							errors.toString(),
							errors > 1,
						),
					);
					break;
				}

				case "cancel": {
					buttonInteraction.update({
						content: translations.strings.cancelled(),
						components: [
							{
								type: "ACTION_ROW",
								components: [
									{
										type: "BUTTON",
										customId: "confirm",
										emoji: Util.config.EMOJIS.check.data,
										style: "SUCCESS",
										disabled: true,
									},
									{
										type: "BUTTON",
										customId: "cancel",
										emoji: Util.config.EMOJIS.cross.data,
										style: "DANGER",
										disabled: true,
									},
								],
							},
						],
					});
					break;
				}
			}
		} catch (err) {
			interaction.editReply({
				content: translations.strings.cancelled(),
				components: [
					{
						type: "ACTION_ROW",
						components: [
							{
								type: "BUTTON",
								customId: "confirm",
								emoji: Util.config.EMOJIS.check.data,
								style: "SUCCESS",
								disabled: true,
							},
							{
								type: "BUTTON",
								customId: "cancel",
								emoji: Util.config.EMOJIS.cross.data,
								style: "DANGER",
								disabled: true,
							},
						],
					},
				],
			});
		}
	},
};

export default command;
