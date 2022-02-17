import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

const command: Command = {
	name: "remove",
	aliases: ["rm"],
	description: {
		fr: "Retirer une musique de la queue",
		en: "Remove a song from the queue",
	},
	usage: "<song>[-<song>] ...",
	userPermissions: [],
	botPermissions: ["USE_EXTERNAL_EMOJIS"],
	voice: true,
	voicePlaying: true,

	options: {
		fr: [
			{
				name: "songs",
				description: "Le numéro des musiques ou des intervalles (e.g. 4 6-13)",
				type: "STRING",
				required: false,
			},
		],
		en: [
			{
				name: "songs",
				description: "The song numbers or song intervals (e.g. 4 6-13)",
				type: "STRING",
				required: false,
			},
		],
	},

	runInteraction: async (interaction, translations) => {
		const checkRegex = /^(?:\d+(?:-\d+)?(?:\s|$))+/;

		const input = interaction.options.getString("songs");

		if (input && !checkRegex.test(input))
			return interaction.followUp(translations.strings.invalid_input());

		const queue = Util.musicPlayer.get(interaction.guild.id);

		const songIndexes = input
			? input
					.split(" ")
					.map((part) => {
						if (/\d+-\d+/.test(part)) {
							const [, left, right] = part
								.match(/(\d+)-(\d+)/)
								.map((a) => parseInt(a));

							const start = Math.min(left, right);
							const end = Math.max(left, right);

							// Create a range between start and end
							return Array.from(Array(end - start + 1), (_, i) => i + start);
						} else {
							return parseInt(part);
						}
					})
					.flat(1)
			: [queue.songs.length - 1];

		if (songIndexes.some((s) => s === 0 || s >= queue.songs.length))
			return interaction.followUp(
				translations.strings.invalid_numbers(
					(queue.songs.length - 1).toString(),
				),
			);

		const songs = queue.remove(songIndexes);

		interaction.followUp(
			translations.strings.removed(
				songs.length.toString(),
				songs.length > 1,
				songs.length === 1,
				songs[0].name,
			),
		);
	},
};

export default command;
