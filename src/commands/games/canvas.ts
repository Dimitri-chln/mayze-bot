import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import Translations from "../../types/structures/Translations";
import Util from "../../Util";

import pagination, { Page } from "../../utils/misc/pagination";
import { ButtonInteraction, CollectorFilter, MessageAttachment } from "discord.js";



const command: Command = {
	name: "canvas",
	description: {
		fr: "Rejoindre un canevas",
		en: "Join a canvas"
	},
	userPermissions: [],
	botPermissions: ["EMBED_LINKS"],
	
	options: {
		fr: [
			{
				name: "join",
				description: "Rejoindre un canevas",
				type: "SUB_COMMAND",
				options: [
					{
						name: "canvas",
						description: "Le nom du canevas",
						type: "STRING",
						required: true
					}
				]
			},
			{
				name: "list",
				description: "Obtenir la liste de tous les canevas",
				type: "SUB_COMMAND"
			},
			{
				name: "palettes",
				description: "Voir les palettes de couleurs disponibles",
				type: "SUB_COMMAND"
			},
			{
				name: "place",
				description: "Placer un pixel sur le canevas",
				type: "SUB_COMMAND",
				options: [
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
						description: "La couleur du pixel. Voir /canvas palettes",
						type: "STRING",
						required: true
					}
				]
			},
			{
				name: "place-chain",
				description: "Placer plusieurs pixels sur le canevas",
				type: "SUB_COMMAND",
				options: [
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
						description: "La couleur du pixel. Voir /canvas palettes",
						type: "STRING",
						required: true
					}
				]
			},
			{
				name: "view",
				description: "Voir une image du canevas",
				type: "SUB_COMMAND",
				options: [
					{
						name: "x",
						description: "L'abscisse du pixel en haut à gauche de l'image",
						type: "INTEGER",
						required: false,
						minValue: 0
					},
					{
						name: "y",
						description: "L'ordonnées du pixel en haut à gauche de l'image",
						type: "INTEGER",
						required: false,
						minValue: 0
					},
					{
						name: "zoom",
						description: "La taille de l'image en pixels",
						type: "INTEGER",
						required: false,
						minValue: 0
					}
				]
			},
			{
				name: "view-nav",
				description: "Naviguer dans le canevas",
				type: "SUB_COMMAND",
				options: [
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
					}
				]
			}
		],
		en: [
			{
				name: "join",
				description: "Join a canvas",
				type: "SUB_COMMAND",
				options: [
					{
						name: "canvas",
						description: "The name of the canvas",
						type: "STRING",
						required: true
					}
				]
			},
			{
				name: "list",
				description: "Get the list of all available canvas",
				type: "SUB_COMMAND"
			},
			{
				name: "palettes",
				description: "See the palettes of available colors",
				type: "SUB_COMMAND"
			},
			{
				name: "place",
				description: "Place a pixel on the canvas",
				type: "SUB_COMMAND",
				options: [
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
						description: "The color of the pixel. See /canvas palettes",
						type: "STRING",
						required: true
					}
				]
			},
			{
				name: "place-chain",
				description: "Place several pixels on the canvas",
				type: "SUB_COMMAND",
				options: [
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
						description: "The color of the pixel. See /canvas palettes",
						type: "STRING",
						required: true
					}
				]
			},
			{
				name: "view",
				description: "See an image of the canvas",
				type: "SUB_COMMAND",
				options: [
					{
						name: "x",
						description: "The x coordinate of the pixel in the top left corner of the image",
						type: "INTEGER",
						required: false,
						minValue: 0
					},
					{
						name: "y",
						description: "The y coordinate of the pixel in the top left corner of the image",
						type: "INTEGER",
						required: false,
						minValue: 0
					},
					{
						name: "zoom",
						description: "The size of the image in pixels",
						type: "INTEGER",
						required: false,
						minValue: 0
					}
				]
			},
			{
				name: "view-nav",
				description: "Navigate in the canvas",
				type: "SUB_COMMAND",
				options: [
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
					}
				]
			}
		]
	},
	
	run: async (interaction, translations) => {
		const subCommand = interaction.options.getSubcommand();
		
		const userCanvas = Util.canvas.filter(canvas =>
			canvas.owner.type === "EVERYONE"
			|| canvas.owner.type === "GUILD" && canvas.owner.id === interaction.guild.id
			|| canvas.owner.type === "CHANNEL" && canvas.owner.id === interaction.channel.id
			|| canvas.owner.type === "USER" && canvas.owner.id === interaction.user.id
		);
		
		switch (subCommand) {
			case "list": {
				interaction.reply({
					embeds: [
						{
							author: {
								name: translations.data.title(),
								iconURL: interaction.client.user.displayAvatarURL()
							},
							color: interaction.guild.me.displayColor,
							description: userCanvas.map(canvas => `\`${canvas.name.replace(/-\d{18}/, "")}\` - **${canvas.size}x${canvas.size}**`).join("\n"),
							footer: {
								text: "✨ Mayze ✨"
							}
						}
					]
				});
				break;
			}

			case "join": {
				const canvasName = interaction.options.getString("canvas").toLowerCase();
				const newCanvas = userCanvas.find(canvas => canvas.name === canvasName); 

				if (!newCanvas) return interaction.reply(translations.data.invalid_canvas());

				newCanvas.addUser(interaction.user);

				interaction.reply({
					content: translations.data.joined(canvasName),
					ephemeral: true
				});
				break;
			}

			case "palettes": {
				const pages: Page[] = [];
		
				for (const [ name, palette ] of Util.palettes) {
					const page: Page = {
						embeds: [
							{
								author: {
									name: translations.data.palette_title(),
									iconURL: interaction.client.user.displayAvatarURL()
								},
								title: translations.data.palette(name),
								color: interaction.guild.me.displayColor,
								description: palette.all().map((color, alias) => `${color.emoji} \`${alias}\` - **${color.name}** \`${color.hex}\``).join("\n")
							}
						]
					};

					pages.push(page);
				}

				pagination(interaction, pages);
				break;
			}

			case "place": {
				const canvas = Util.canvas.find(c => c.users.has(interaction.user.id));
				if (!canvas) return interaction.reply({
					content: translations.data.not_in_canvas(),
					ephemeral: true
				});

				let x = interaction.options.getInteger("x");
				let y = interaction.options.getInteger("y")
				
				if (x < 0 || y < 0 || x >= canvas.size || y >= canvas.size)
					return interaction.reply({
						content: translations.data.invalid_coordinates(),
						ephemeral: true
					});

				const colorName = interaction.options.getString("color");
				if (!Util.palettes.some(palette => palette.has(colorName))) 
					return interaction.reply({
						content: translations.data.invalid_color(),
						ephemeral: true
					});
				const color = Util.palettes.find(palette => palette.has(colorName)).get(colorName);
				
				await canvas.setPixel(x, y, color.alias);
				
				const grid = await canvas.viewGrid(x, y);
				
				interaction.reply({
					content: grid.format(),
					embeds: [
						{
							author: {
								name: interaction.user.tag,
								iconURL: interaction.user.displayAvatarURL({ dynamic: true })
							},
							color: interaction.guild.me.displayColor,
							description: translations.data.pixel_placed(
								color.emoji.toString(),
								color.alias
							),
							footer: {
								text: "✨ Mayze ✨"
							}
						}
					]
				});
				break;
			}

			case "place-chain": {
				const canvas = Util.canvas.find(c => c.users.has(interaction.user.id));
				if (!canvas) return interaction.reply({
					content: translations.data.not_in_canvas(),
					ephemeral: true
				});

				let x = interaction.options.getInteger("x");
				let y = interaction.options.getInteger("y")
				
				if (x < 0 || y < 0 || x >= canvas.size || y >= canvas.size)
					return interaction.reply({
						content: translations.data.invalid_coordinates(),
						ephemeral: true
					});

				const colorName = interaction.options.getString("color");
				if (!Util.palettes.some(palette => palette.has(colorName))) 
					return interaction.reply({
						content: translations.data.invalid_color(),
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
							description: translations.data.placing(
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
								description: translations.data.placing(
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
								description: translations.data.placing(
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
				break;
			}

			case "view": {
				const canvas = Util.canvas.find(c => c.users.has(interaction.user.id));
				if (!canvas) return interaction.reply({
					content: translations.data.not_in_canvas(),
					ephemeral: true
				});

				let x = interaction.options.getInteger("x") ?? 0;
				let y = interaction.options.getInteger("y") ?? 0;
				
				if (x < 0 || y < 0 || x >= canvas.size || y >= canvas.size)
					return interaction.reply({
						content: translations.data.invalid_coordinates(),
						ephemeral: true
					});

				const zoom = interaction.options.getInteger("zoom") ?? "default";
				if (zoom && zoom !== "default" && (zoom < 1 || zoom > canvas.size))
					return interaction.reply({
						content: translations.data.invalid_zoom(),
						ephemeral: true
				});

				const startLoad = Date.now();
				const image = await canvas.view(x, y, zoom);
				const endLoad = Date.now();

				const attachment = new MessageAttachment(image, "canvas.png");

				interaction.reply({
					embeds: [
						{
							title: translations.data.view_title(
								canvas.name.replace(/^./, a => a.toUpperCase()),
								canvas.size.toString(),
								((endLoad - startLoad) / 1000).toString()
							),
							color: interaction.guild.me.displayColor,
							image: {
								url: "attachment://canvas.png"
							},
							footer: {
								iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
								text: "✨ Mayze ✨"
							},
						}
					],
					attachments: [ attachment ]
				});
				break;
			}

			case "view-nav": {
				const canvas = Util.canvas.find(c => c.users.has(interaction.user.id));
				if (!canvas) return interaction.reply({
					content: translations.data.not_in_canvas(),
					ephemeral: true
				});

				let x = interaction.options.getInteger("x");
				let y = interaction.options.getInteger("y")
				
				if (x < 0 || y < 0 || x >= canvas.size || y >= canvas.size)
					return interaction.reply({
						content: translations.data.invalid_coordinates(),
						ephemeral: true
					});

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
				break;
			}
		}
	}
};



export default command;