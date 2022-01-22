import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import LanguageStrings from "../../types/structures/LanguageStrings";
import Util from "../../Util";

import { ButtonInteraction, CollectorFilter } from "discord.js";



const command: Command = {
	name: "place-chain",
	description: {
		fr: "Placer plusieurs pixels sur le canevas",
		en: "Place multiple pixels on the canvas"
	},
	userPermissions: [],
	botPermissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS"],
	
	options: {
		fr: [
			{
				name: "x",
				description: "L'abscisse du pixel",
				type: "INTEGER",
				required: true,
				minValue: 0
			},
			{
				name: "y",
				description: "L'ordonnée du pixel",
				type: "INTEGER",
				required: true,
				minValue: 0
			},
			{
				name: "color",
				description: "La couleur du pixel. Voir /palette",
				type: "STRING",
				required: true
			}
		],
		en: [
			{
				name: "x",
				description: "The x coordinate of the pixel",
				type: "INTEGER",
				required: true,
				minValue: 0
			},
			{
				name: "y",
				description: "The y coordinate of the pixel",
				type: "INTEGER",
				required: true,
				minValue: 0
			},
			{
				name: "color",
				description: "The color of the pixel. See /palette",
				type: "STRING",
				required: true
			}
		]
	},
	
	run: async (interaction: CommandInteraction, languageStrings: LanguageStrings) => {
		const canvas = Util.canvas.find(c => c.users.has(interaction.user.id));
		if (!canvas) return interaction.reply({
			content: languageStrings.data.not_in_canvas(),
			ephemeral: true
		});

		let x = interaction.options.getInteger("x");
		let y = interaction.options.getInteger("y")
		
		if (x < 0 || y < 0 || x >= canvas.size || y >= canvas.size)
			return interaction.reply({
				content: languageStrings.data.invalid_coordinates(),
				ephemeral: true
			});

		const colorName = interaction.options.getString("color");
		if (!Util.palettes.some(palette => palette.has(colorName))) 
			return interaction.reply({
				content: languageStrings.data.invalid_color(),
				ephemeral: true
			});
		const color = Util.palettes.find(palette => palette.has(colorName)).get(colorName);
		
		let grid = await canvas.viewGrid(x, y);

		const reply = await interaction.reply({
			content: grid.format(),
			embeds: [
				{
					author: {
						name: interaction.user.tag,
						iconURL: interaction.user.displayAvatarURL({ dynamic: true })
					},
					color: interaction.guild.me.displayColor,
					description: languageStrings.data.placing(
						color.emoji.toString(),
						color.alias
					),
					footer: {
						text: "✨ Mayze ✨"
					}
				}
			],
			components: [
				{
					type: "ACTION_ROW",
					components: [
						{
							type: "BUTTON",
							customId: "left",
							emoji: "⬅️"
						},
						{
							type: "BUTTON",
							customId: "up",
							emoji: "⬆️"
						},
						{
							type: "BUTTON",
							customId: "down",
							emoji: "⬇️"
						},
						{
							type: "BUTTON",
							customId: "right",
							emoji: "➡️"
						},
						{
							type: "BUTTON",
							customId: "confirm",
							emoji: "✅",
							style: "SUCCESS"
						},
						{
							type: "BUTTON",
							customId: "stop",
							emoji: "❌",
							style: "DANGER"
						}
					]
				}
			],
			fetchReply: true
		}) as Message;

		const filter: CollectorFilter<[ButtonInteraction]> = buttonInteraction => buttonInteraction.user.id === interaction.user.id;
		const collector = reply.createMessageComponentCollector({ componentType: "BUTTON", filter, idle: 120_000 });
		
		collector.on("collect", async buttonInteraction => {
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
					await canvas.setPixel(x, y, colorName);
					break;
				case "cancel":
					collector.stop();
					break;
			}

			grid = await canvas.viewGrid(x, y);

			reply.edit({
				content: grid.format(),
				embeds: [
					{
						author: {
							name: interaction.user.tag,
							iconURL: interaction.user.displayAvatarURL({ dynamic: true })
						},
						color: interaction.guild.me.displayColor,
						description: languageStrings.data.placing(
							color.emoji.toString(),
							color.alias
						),
						footer: {
							text: "✨ Mayze ✨"
						}
					}
				],
				components: [
					{
						type: "ACTION_ROW",
						components: [
							{
								type: "BUTTON",
								customId: "left",
								emoji: "⬅️"
							},
							{
								type: "BUTTON",
								customId: "up",
								emoji: "⬆️"
							},
							{
								type: "BUTTON",
								customId: "down",
								emoji: "⬇️"
							},
							{
								type: "BUTTON",
								customId: "right",
								emoji: "➡️"
							},
							{
								type: "BUTTON",
								customId: "confirm",
								emoji: "✅",
								style: "SUCCESS"
							},
							{
								type: "BUTTON",
								customId: "stop",
								emoji: "❌",
								style: "DANGER"
							}
						]
					}
				]
			});
		});
		
		collector.on("end", () => {
			reply.edit({
				content: grid.format(),
				embeds: [
					{
						author: {
							name: interaction.user.tag,
							iconURL: interaction.user.displayAvatarURL({ dynamic: true })
						},
						color: interaction.guild.me.displayColor,
						description: languageStrings.data.placing(
							color.emoji.toString(),
							color.alias
						),
						footer: {
							text: "✨ Mayze ✨"
						}
					}
				],
				components: [
					{
						type: "ACTION_ROW",
						components: [
							{
								type: "BUTTON",
								customId: "left",
								emoji: "⬅️",
								disabled: true
							},
							{
								type: "BUTTON",
								customId: "up",
								emoji: "⬆️",
								disabled: true
							},
							{
								type: "BUTTON",
								customId: "down",
								emoji: "⬇️",
								disabled: true
							},
							{
								type: "BUTTON",
								customId: "right",
								emoji: "➡️",
								disabled: true
							},
							{
								type: "BUTTON",
								customId: "confirm",
								emoji: "✅",
								style: "SUCCESS",
								disabled: true
							},
							{
								type: "BUTTON",
								customId: "stop",
								emoji: "❌",
								style: "DANGER",
								disabled: true
							}
						]
					}
				]
			});
		});
	}
};



export default command;