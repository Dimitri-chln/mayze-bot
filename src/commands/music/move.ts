import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

const command: Command = {
	name: "move",
	aliases: [],
	description: {
		fr: "Déplacer une musique dans la queue",
		en: "Move a song in the queue",
	},
	usage: "<song> <position>",
	userPermissions: [],
	botPermissions: ["USE_EXTERNAL_EMOJIS"],
	voice: true,
	voicePlaying: true,

	options: {
		fr: [
			{
				name: "song",
				description: "Le musique à déplacer",
				type: "INTEGER",
				required: true,
				autocomplete: true,
			},
			{
				name: "after",
				description: "La position à laquelle déplacer la musique",
				type: "INTEGER",
				required: true,
				autocomplete: true,
			},
		],
		en: [
			{
				name: "song",
				description: "The song to move",
				type: "INTEGER",
				required: true,
				autocomplete: true,
			},
			{
				name: "after",
				description: "The position to move the song to",
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
			return interaction.followUp(translations.strings.invalid_song(queue.songs.length.toString()));

		const after = interaction.options.getInteger("after", true);
		if (after < 0 || after > queue.songs.length)
			return interaction.followUp(translations.strings.invalid_position(queue.songs.length.toString()));

		const song = queue.move(songIndex, after);

		interaction.followUp(translations.strings.moved(song.name));
	},
};

export default command;
