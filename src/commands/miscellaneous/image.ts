import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

import { ukraineOverlay } from "../../assets/image-urls.json";
import Jimp from "jimp";

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

				switch (type) {
					case "ukraine": {
						const overlay = await Jimp.read(ukraineOverlay);

						overlay.resize(
							image.getWidth(),
							image.getHeight(),
							(err, overlay) => {
								image
									.composite(overlay, 0, 0)
									.getBufferAsync(Jimp.MIME_PNG)
									.then((result) => {
										interaction.followUp({
											files: [result],
										});
									});
							},
						);
						break;
					}
				}
				break;
			}
		}
	},
};

export default command;
