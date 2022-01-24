import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import Translations from "../../types/structures/Translations";
import Util from "../../Util";



const command: Command = {
	name: "place",
	description: {
		fr: "Placer un pixel sur le canevas",
		en: "Place a pixel on the canvas"
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
	
	run: async (interaction: CommandInteraction, translations: Translations) => {
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
	}
};



export default command;