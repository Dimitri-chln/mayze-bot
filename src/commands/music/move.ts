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
				description: "Le numéro de la musique à déplacer",
				type: "INTEGER",
				required: true,
				minValue: 1,
			},
			{
				name: "position",
				description: "La position à laquelle déplacer la musique",
				type: "INTEGER",
				required: true,
				minValue: 1,
			},
		],
		en: [
			{
				name: "song",
				description: "The number of the song to move",
				type: "INTEGER",
				required: true,
				minValue: 1,
			},
			{
				name: "position",
				description: "The position to move the song to",
				type: "INTEGER",
				required: true,
				minValue: 1,
			},
		],
	},

	runInteraction: async (interaction, translations) => {
		const queue = Util.musicPlayer.get(interaction.guild.id);

		const songIndex = interaction.options.getInteger("song");
		if (songIndex < 1 || songIndex > queue.songs.length)
			return interaction.followUp(
				translations.strings.invalid_song(queue.songs.length.toString()),
			);

		const position = interaction.options.getInteger("position");
		if (position < 1 || position > queue.songs.length)
			return interaction.followUp(
				translations.strings.invalid_position(queue.songs.length.toString()),
			);

		const song = queue.move(songIndex, position);

		interaction.followUp(translations.strings.moved(song.name));
	},
};

export default command;

const commmand = {
	run: async (message, args, options, language, languageCode) => {},
};

module.exports = command;
