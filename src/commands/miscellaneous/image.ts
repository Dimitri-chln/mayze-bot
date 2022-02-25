import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

import Jimp from "jimp";
import distanceFromCenter from "../../utils/misc/distanceFromCenter";

const command: Command = {
	name: "image",
	aliases: ["img"],
	description: {
		fr: "Manipuler et générer des images",
		en: "Manipulate and generate images",
	},
	usage: "<type>",
	userPermissions: [],
	botPermissions: ["ATTACH_FILES"],

	options: {
		fr: [
			{
				name: "overlay",
				description: "Ajouter un overlay à ta photo de profil",
				type: "SUB_COMMAND",
				options: [
					{
						name: "type",
						description: "Le type d'image à générer",
						type: "STRING",
						required: true,
						autocomplete: true,
					},
				],
			},
		],
		en: [
			{
				name: "overlay",
				description: "Add an overlay to your profile picture",
				type: "SUB_COMMAND",
				options: [
					{
						name: "type",
						description: "The type of image to generate",
						type: "STRING",
						required: true,
						autocomplete: true,
					},
				],
			},
		],
	},

	runInteraction: async (interaction, translations) => {
		const subCommand = interaction.options.getSubcommand();

		switch (subCommand) {
			case "overlay": {
				const type = interaction.options.getString("type", true).toLowerCase();

				if (!Util.config.IMAGE_GENERATION_TYPES.includes(type))
					return interaction.followUp(translations.strings.invalid_type());

				const image = await Jimp.read(
					interaction.user.displayAvatarURL({ format: "png", size: 4096 }),
				);
				const width = image.getWidth();
				const height = image.getHeight();

				let color: (x: number, y: number) => number = (x, y) => 0xffffffff;

				switch (type) {
					case "france": {
						const blue = 0x002395ff;
						const white = 0xffffffff;
						const red = 0xed2939ff;

						color = (x, y) => {
							if (x < width / 3) return blue;
							if (x < (2 * width) / 3) return white;
							return red;
						};
						break;
					}

					case "ukraine": {
						const blue = 0x0057b7ff;
						const yellow = 0xffdd00ff;

						color = (x, y) => {
							if (y < height / 2) return blue;
							return yellow;
						};
						break;
					}
				}

				for (let y = 0; y < height; y++) {
					for (let x = 0; x < width; x++) {
						if (distanceFromCenter(x, y, width, height) > 0.9 * (width / 2))
							image.setPixelColor(color(x, y), x, y);
					}
				}

				const result = await image.getBufferAsync(Jimp.MIME_PNG);

				interaction.followUp({
					files: [result],
				});
				break;
			}
		}
	},
};

export default command;
