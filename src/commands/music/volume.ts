import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

const command: Command = {
	name: "volume",
	aliases: ["vol"],
	description: {
		fr: "Ajuster le volume de la musique",
		en: "Adjust the volume of the music",
	},
	usage: "[<volume>]",
	userPermissions: [],
	botPermissions: ["USE_EXTERNAL_EMOJIS"],
	voice: true,
	voicePlaying: true,

	options: {
		fr: [
			{
				name: "volume",
				description: "Le nouveau volume",
				type: "INTEGER",
				required: false,
				minValue: 0,
				maxValue: 200,
			},
		],
		en: [
			{
				name: "volume",
				description: "The new volume",
				type: "INTEGER",
				required: false,
				minValue: 0,
				maxValue: 200,
			},
		],
	},

	runInteraction: async (interaction, translations) => {
		const volume = interaction.options.getInteger("volume", false);

		const queue = Util.musicPlayer.get(interaction.guild.id);

		if (!volume) {
			interaction.followUp(
				translations.strings.volume(queue.volume.toString()),
			);
		} else {
			if (volume < 0 || volume > 200)
				return interaction.followUp(translations.strings.invalid_volume());

			queue.setVolume(volume);

			interaction.followUp(
				translations.strings.volume_changed(volume.toString()),
			);
		}
	},
};

export default command;
