import { CommandData } from "../../structures/commands/Command";
import {
	ApplicationCommandOptionType,
	ButtonInteraction,
	ButtonStyle,
	CollectorFilter,
	ComponentType,
	PermissionFlagsBits,
	PermissionsBitField,
	StringSelectMenuInteraction,
} from "discord.js";
import Util from "../../Util";

import { CanvasOwnerType } from "../../types/Database";

import pagination, { Page } from "../../utils/misc/pagination";

const command: CommandData = {
	name: "canvas",
	aliases: [],
	userPermissions: new PermissionsBitField(),
	botPermissions: new PermissionsBitField([PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AttachFiles]),

	options: [
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "list",
			description: undefined,
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "join",
			description: undefined,
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: "canvas",
					description: undefined,
					required: true,
					autocomplete: true,
				},
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "palettes",
			description: undefined,
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "place",
			description: undefined,
			options: [
				{
					type: ApplicationCommandOptionType.Integer,
					name: "x",
					description: undefined,
					required: true,
					min_value: 0,
				},
				{
					type: ApplicationCommandOptionType.Integer,
					name: "y",
					description: undefined,
					required: true,
					min_value: 0,
				},
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "view",
			description: undefined,
			options: [
				{
					type: ApplicationCommandOptionType.Integer,
					name: "x",
					description: undefined,
					required: false,
					min_value: 0,
				},
				{
					type: ApplicationCommandOptionType.Integer,
					name: "y",
					description: undefined,
					required: false,
					min_value: 0,
				},
				{
					type: ApplicationCommandOptionType.Integer,
					name: "zoom",
					description: undefined,
					required: false,
					min_value: 0,
				},
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "navigation",
			description: undefined,
			options: [
				{
					type: ApplicationCommandOptionType.Integer,
					name: "x",
					description: undefined,
					required: true,
					min_value: 0,
				},
				{
					type: ApplicationCommandOptionType.Integer,
					name: "y",
					description: undefined,
					required: true,
					min_value: 0,
				},
			],
		},
	],

	run: {
		list: async function (input, args, localizations) {
			const availableCanvas = Util.canvas.filter(
				(canvas) =>
					canvas.owner.type === CanvasOwnerType.EVERYONE ||
					(canvas.owner.type === CanvasOwnerType.GUILD && canvas.owner.id === input.guild.id) ||
					(canvas.owner.type === CanvasOwnerType.CHANNEL && canvas.owner.id === input.channel.id) ||
					(canvas.owner.type === CanvasOwnerType.USER && canvas.owner.id === input.user.id),
			);

			input.reply({
				embeds: [
					{
						author: {
							name: localizations.author.format(input.locale),
							icon_url: input.client.user.displayAvatarURL(),
						},
						color: input.guild.members.me.displayColor,
						// U+00d7 : ×
						description: availableCanvas
							.map((canvas) => `\`${canvas.name.replace(/-\d{18,20}/, "")}\` - **${canvas.size}\u00d7${canvas.size}**`)
							.join("\n"),
						footer: {
							text: Util.config.DEFAULT_EMBED_FOOTER_TEXT,
						},
					},
				],
			});
		},

		join: async function (input, args, localizations) {
			const canvasName = args.get("canvas") as string;

			const availableCanvas = Util.canvas.filter(
				(canvas) =>
					canvas.owner.type === CanvasOwnerType.EVERYONE ||
					(canvas.owner.type === CanvasOwnerType.GUILD && canvas.owner.id === input.guild.id) ||
					(canvas.owner.type === CanvasOwnerType.CHANNEL && canvas.owner.id === input.channel.id) ||
					(canvas.owner.type === CanvasOwnerType.USER && canvas.owner.id === input.user.id),
			);

			const newCanvas = availableCanvas.find((canvas) => canvas.name === canvasName);
			if (!newCanvas) {
				await input.reply(localizations.invalid_canvas.format(input.locale));
				return;
			}

			await newCanvas.addUser(input.user);
			input.reply(localizations.joined.format(input.locale, canvasName));
		},

		palettes: async function (input, args, localizations) {
			const canvas = Util.canvas.find((c) => c.users.has(input.user.id));
			if (!canvas) {
				await input.reply(
					localizations.no_canvas.format(
						input.locale,
						Util.client.application.commands.cache.find((cmd) => cmd.name === input.command.name.default).id,
					),
				);
				return;
			}

			if (!canvas.palettes.size) {
				await input.reply(localizations.no_palette.format(input.locale));
				return;
			}

			const pages: Page[] = [];

			canvas.palettes.forEach((palette) => {
				const page: Page = {
					embeds: [
						{
							author: {
								name: localizations.author.format(input.locale),
								icon_url: input.client.user.displayAvatarURL(),
							},
							title: localizations.title.format(input.locale, palette.name),
							color: input.guild.members.me.displayColor,
							description: palette.colors
								.map((color) => `${color.emoji.toString()} \`${color.alias}\` - **${color.name}** \`${color.hex}\``)
								.join("\n"),
						},
					],
				};

				pages.push(page);
			});

			pagination(input, pages);
		},

		place: async function (input, args, localizations) {
			let x = args.get("x") as number;
			let y = args.get("y") as number;

			const canvas = Util.canvas.find((c) => c.users.has(input.user.id));
			if (!canvas) {
				await input.reply(
					localizations.no_canvas.format(
						input.locale,
						Util.client.application.commands.cache.find((cmd) => cmd.name === input.command.name.default).id,
					),
				);
				return;
			}

			if (x < 0 || y < 0 || x >= canvas.size || y >= canvas.size) {
				await input.reply(localizations.invalid_coordinates.format(input.locale));
				return;
			}

			let currentPalette = Util.palettes.find((palette) => palette.name === "default");
			let currentColor = currentPalette.colors.find((color) => color.alias === "blnk");

			let grid = await canvas.viewGrid(x, y);

			const reply = await input.reply({
				content: grid.display(),
				components: getComponents(),
			});

			const stringSelectMenuFilter: CollectorFilter<[StringSelectMenuInteraction]> = (stringSelectMenuInteraction) =>
				stringSelectMenuInteraction.user.id === input.user.id;

			const stringSelectMenuCollector = reply.createMessageComponentCollector({
				componentType: ComponentType.StringSelect,
				filter: stringSelectMenuFilter,
			});

			stringSelectMenuCollector.on("collect", (stringSelectMenuInteraction) => {
				switch (stringSelectMenuInteraction.customId) {
					case "palette_picker": {
						currentPalette = Util.palettes.get(parseInt(stringSelectMenuInteraction.values[0]));
						currentColor = currentPalette.colors.first();
						break;
					}

					case "color_picker": {
						currentColor = currentPalette.colors.get(parseInt(stringSelectMenuInteraction.values[0]));
						break;
					}
				}

				stringSelectMenuInteraction.update({
					content: grid.display(),
					components: getComponents(),
				});
			});

			const buttonFilter: CollectorFilter<[ButtonInteraction]> = (buttonInteraction) =>
				buttonInteraction.user.id === input.user.id;

			const buttonCollector = reply.createMessageComponentCollector({
				componentType: ComponentType.Button,
				filter: buttonFilter,
				idle: 120_000,
			});

			buttonCollector.on("collect", async (buttonInteraction) => {
				switch (buttonInteraction.customId) {
					case "left":
						if (x > 0) x--;
						break;
					case "up":
						if (y > 0) y--;
						break;
					case "down":
						if (y < canvas.size - 1) y++;
						break;
					case "right":
						if (x < canvas.size - 1) x++;
						break;
					case "confirm":
						await canvas.setPixel(x, y, currentColor);
						break;
				}

				grid = await canvas.viewGrid(x, y);

				buttonInteraction.update({
					content: grid.display(),
					components: getComponents(),
				});
			});

			buttonCollector.once("end", (collected, reason) => {
				stringSelectMenuCollector.stop();

				if (reason !== "messageDelete")
					input.editReply({
						content: grid.display(),
						components: getComponents(true),
					});
			});

			function getComponents(disabled: boolean = false) {
				const components = [
					{
						type: ComponentType.ActionRow as ComponentType.ActionRow,
						components: [
							{
								type: ComponentType.StringSelect as ComponentType.StringSelect,
								customId: "palette_picker",
								placeholder: localizations.palette_placeholder.format(input.locale),
								options: Util.palettes.map((p) => {
									return {
										label: p.name.replace(/^./, (match) => match.toUpperCase()),
										value: p.id.toString(),
										default: p.name === currentPalette.name,
									};
								}),
								disabled: disabled,
							},
						],
					},
					{
						type: ComponentType.ActionRow as ComponentType.ActionRow,
						components: [
							{
								type: ComponentType.StringSelect as ComponentType.StringSelect,
								customId: "color_picker",
								placeholder: localizations.color_placeholder.format(input.locale),
								options: currentPalette.colors.map((c) => {
									return {
										label: c.name,
										value: c.id.toString(),
										description: c.hex,
										emoji: c.emoji,
										default: c.alias === currentColor.alias,
									};
								}),
								disabled: disabled,
							},
						],
					},
					{
						type: ComponentType.ActionRow as ComponentType.ActionRow,
						components: [
							{
								type: ComponentType.Button as ComponentType.Button,
								customId: "top_left",
								emoji: { id: "829352737946730576", name: "blank" },
								style: ButtonStyle.Secondary as ButtonStyle.Secondary,
								disabled: true,
							},
							{
								type: ComponentType.Button as ComponentType.Button,
								customId: "up",
								emoji: "⬆️",
								style: ButtonStyle.Primary as ButtonStyle.Primary,
								disabled: disabled,
							},
							{
								type: ComponentType.Button as ComponentType.Button,
								customId: "top_right",
								emoji: { id: "829352737946730576", name: "blank" },
								style: ButtonStyle.Secondary as ButtonStyle.Secondary,
								disabled: true,
							},
						],
					},
					{
						type: ComponentType.ActionRow as ComponentType.ActionRow,
						components: [
							{
								type: ComponentType.Button as ComponentType.Button,
								customId: "left",
								emoji: "⬅️",
								style: ButtonStyle.Primary as ButtonStyle.Primary,
								disabled: disabled,
							},
							{
								type: ComponentType.Button as ComponentType.Button,
								customId: "confirm",
								emoji: Util.config.EMOJIS.check.data,
								style: ButtonStyle.Success as ButtonStyle.Success,
								disabled: disabled,
							},
							{
								type: ComponentType.Button as ComponentType.Button,
								customId: "right",
								emoji: "➡️",
								style: ButtonStyle.Primary as ButtonStyle.Primary,
								disabled: disabled,
							},
						],
					},
					{
						type: ComponentType.ActionRow as ComponentType.ActionRow,
						components: [
							{
								type: ComponentType.Button as ComponentType.Button,
								customId: "bottom_right",
								emoji: { id: "829352737946730576", name: "blank" },
								style: ButtonStyle.Secondary as ButtonStyle.Secondary,
								disabled: true,
							},
							{
								type: ComponentType.Button as ComponentType.Button,
								customId: "down",
								emoji: "⬇️",
								style: ButtonStyle.Primary as ButtonStyle.Primary,
								disabled: disabled,
							},
							{
								type: ComponentType.Button as ComponentType.Button,
								customId: "bottom_left",
								emoji: { id: "829352737946730576", name: "blank" },
								style: ButtonStyle.Secondary as ButtonStyle.Secondary,
								disabled: true,
							},
						],
					},
				];

				return components;
			}
		},

		view: async function (input, args, localizations) {
			const x = (args.get("x") as number) ?? 0;
			const y = (args.get("y") as number) ?? 0;
			const zoom = (args.get("zoom") as number) ?? "default";

			const canvas = Util.canvas.find((c) => c.users.has(input.user.id));
			if (!canvas) {
				await input.reply(
					localizations.no_canvas.format(
						input.locale,
						Util.client.application.commands.cache.find((cmd) => cmd.name === input.command.name.default).id,
					),
				);
				return;
			}

			if (x < 0 || y < 0 || x >= canvas.size || y >= canvas.size) {
				await input.reply(localizations.invalid_coordinates.format(input.locale));
				return;
			}

			if (zoom && zoom !== "default" && (zoom < 1 || zoom > canvas.size)) {
				await input.reply(localizations.invalid_zoom.format(input.locale));
				return;
			}

			const image = await canvas.view(x, y, zoom);

			input.reply({
				embeds: [
					{
						author: {
							name: localizations.author.format(
								input.locale,
								canvas.name.replace(/^./, (match) => match.toUpperCase()),
								canvas.size.toString(),
							),
							icon_url: input.client.user.displayAvatarURL(),
						},
						color: input.guild.members.me.displayColor,
						image: {
							url: "attachment://canvas.png",
						},
						footer: {
							text: Util.config.DEFAULT_EMBED_FOOTER_TEXT,
							icon_url: input.user.displayAvatarURL(),
						},
					},
				],
				files: [
					{
						attachment: image,
						name: "canvas.png",
					},
				],
			});
		},

		navigation: async function (input, args, localizations) {
			let x = args.get("x") as number;
			let y = args.get("y") as number;

			const canvas = Util.canvas.find((c) => c.users.has(input.user.id));
			if (!canvas) {
				await input.reply(
					localizations.no_canvas.format(
						input.locale,
						Util.client.application.commands.cache.find((cmd) => cmd.name === input.command.name.default).id,
					),
				);
				return;
			}

			if (x < 0 || y < 0 || x >= canvas.size || y >= canvas.size) {
				await input.reply(localizations.invalid_coordinates.format(input.locale));
				return;
			}

			let grid = await canvas.viewGrid(x, y);

			const reply = await input.reply({
				content: grid.display(),
				embeds: [
					{
						author: {
							name: input.user.tag,
							icon_url: input.user.displayAvatarURL(),
						},
						color: input.guild.members.me.displayColor,
						footer: {
							text: Util.config.DEFAULT_EMBED_FOOTER_TEXT,
						},
					},
				],
				components: getComponents(),
			});

			const buttonFilter: CollectorFilter<[ButtonInteraction]> = (buttonInteraction) =>
				buttonInteraction.user.id === input.user.id;

			const buttonCollector = reply.createMessageComponentCollector({
				componentType: ComponentType.Button,
				filter: buttonFilter,
				idle: 120_000,
			});

			buttonCollector.on("collect", async (buttonInteraction) => {
				switch (buttonInteraction.customId) {
					case "left":
						if (x > 0) x--;
						break;
					case "up":
						if (y > 0) y--;
						break;
					case "down":
						if (y < canvas.size - 1) y++;
						break;
					case "right":
						if (x < canvas.size - 1) x++;
						break;
				}

				grid = await canvas.viewGrid(x, y);

				buttonInteraction.update({
					content: grid.display(),
					embeds: reply.embeds,
					components: reply.components,
				});
			});

			buttonCollector.once("end", (collected, reason) => {
				if (reason !== "messageDelete")
					input.editReply({
						content: grid.display(),
						embeds: reply.embeds,
						components: getComponents(true),
					});
			});

			function getComponents(disabled: boolean = false) {
				const components = [
					{
						type: ComponentType.ActionRow as ComponentType.ActionRow,
						components: [
							{
								type: ComponentType.Button as ComponentType.Button,
								customId: "top_left",
								emoji: { id: "829352737946730576", name: "blank" },
								style: ButtonStyle.Secondary as ButtonStyle.Secondary,
								disabled: true,
							},
							{
								type: ComponentType.Button as ComponentType.Button,
								customId: "up",
								emoji: "⬆️",
								style: ButtonStyle.Primary as ButtonStyle.Primary,
							},
							{
								type: ComponentType.Button as ComponentType.Button,
								customId: "top_right",
								emoji: { id: "829352737946730576", name: "blank" },
								style: ButtonStyle.Secondary as ButtonStyle.Secondary,
								disabled: true,
							},
						],
					},
					{
						type: ComponentType.ActionRow as ComponentType.ActionRow,
						components: [
							{
								type: ComponentType.Button as ComponentType.Button,
								customId: "left",
								emoji: "⬅️",
								style: ButtonStyle.Primary as ButtonStyle.Primary,
							},
							{
								type: ComponentType.Button as ComponentType.Button,
								customId: "middle",
								emoji: { id: "829352737946730576", name: "blank" },
								style: ButtonStyle.Secondary as ButtonStyle.Secondary,
								disabled: true,
							},
							{
								type: ComponentType.Button as ComponentType.Button,
								customId: "right",
								emoji: "➡️",
								style: ButtonStyle.Primary as ButtonStyle.Primary,
							},
						],
					},
					{
						type: ComponentType.ActionRow as ComponentType.ActionRow,
						components: [
							{
								type: ComponentType.Button as ComponentType.Button,
								customId: "bottom_right",
								emoji: { id: "829352737946730576", name: "blank" },
								style: ButtonStyle.Secondary as ButtonStyle.Secondary,
								disabled: true,
							},
							{
								type: ComponentType.Button as ComponentType.Button,
								customId: "down",
								emoji: "⬇️",
								style: ButtonStyle.Primary as ButtonStyle.Primary,
							},
							{
								type: ComponentType.Button as ComponentType.Button,
								customId: "bottom_left",
								emoji: { id: "829352737946730576", name: "blank" },
								style: ButtonStyle.Secondary as ButtonStyle.Secondary,
								disabled: true,
							},
						],
					},
				];

				return components;
			}
		},
	},
};

export default command;
