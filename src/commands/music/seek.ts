import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

const command: Command = {
	name: "seek",
	aliases: ["go-to", "goto"],
	description: {
		fr: "Chercher une partie de la musique",
		en: "Seek to a part of the song",
	},
	usage: "<timestamp>",
	userPermissions: [],
	botPermissions: ["USE_EXTERNAL_EMOJIS"],
	voice: true,
	voicePlaying: true,

	options: {
		fr: [
			{
				name: "timestamp",
				description: "La durée à chercher dans la musique (ex: 2:15)",
				type: "STRING",
				required: true,
			},
		],
		en: [
			{
				name: "timestamp",
				description: "The timestamp to seek in the song (e.g. 2:15)",
				type: "STRING",
				required: true,
			},
		],
	},

	runInteraction: async (interaction, translations) => {
		const timestamp = interaction.options.getString("timestamp", true);

		if (!/(?:(\d+):)?([0-5]?\d):([0-5]\d)/.test(timestamp))
			return interaction.followUp(translations.strings.invalid_timestamp());

		const queue = Util.musicPlayer.get(interaction.guild.id);
		if (queue.nowPlaying.live) {
			interaction.followUp(translations.strings.live_video());
		} else {
			const song = queue.seek(Util.music.timeToMilliseconds(timestamp) / 1000);
			interaction.followUp(translations.strings.seeked(timestamp, song.name));
		}
	},
};

export default command;
