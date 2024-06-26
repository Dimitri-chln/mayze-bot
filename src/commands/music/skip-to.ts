import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

const command: Command = {
	name: "skip-to",
	aliases: ["skipto", "st"],
	description: {
		fr: "Passer directement à une certaine musique",
		en: "Skip to a certain song in the queue",
	},
	usage: "<song>",
	userPermissions: [],
	botPermissions: ["USE_EXTERNAL_EMOJIS"],
	voice: true,
	voicePlaying: true,

	options: {
		fr: [
			{
				name: "song",
				description: "La musique à laquelle passer",
				type: "INTEGER",
				required: true,
				autocomplete: true,
			},
		],
		en: [
			{
				name: "song",
				description: "The song to skip to",
				type: "INTEGER",
				required: true,
				autocomplete: true,
			},
		],
	},

	runInteraction: async (interaction, translations) => {
		const queue = Util.musicPlayer.get(interaction.guild.id);

		const songIndex = interaction.options.getInteger("song", true);

		if (songIndex < 1 || songIndex > queue.songs.length)
			return interaction.followUp(translations.strings.invalid_number((length - 1).toString()));

		const song = queue.skipTo(songIndex);

		interaction.followUp(translations.strings.skipped(songIndex.toString(), songIndex > 1, song.name));
	},
};

export default command;
