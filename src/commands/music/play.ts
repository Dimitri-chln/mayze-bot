import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

import { GuildMember, TextChannel, VoiceChannel } from "discord.js";
import Axios from "axios";
import PlayDl from "play-dl";
import MusicUtil from "../../utils/music/MusicUtil";

const command: Command = {
	name: "play",
	aliases: ["p"],
	description: {
		fr: "Jouer une musique",
		en: "Play a song",
	},
	usage: "<song/playlist> [-shuffle]",
	userPermissions: [],
	botPermissions: ["CONNECT", "SPEAK", "USE_EXTERNAL_EMOJIS"],
	voice: true,

	options: {
		fr: [
			{
				name: "song",
				description: "La musique ou playlist à jouer",
				type: "STRING",
				required: true,
			},
			{
				name: "shuffle",
				description: "Mélanger la playlist au moment de l'ajout",
				type: "BOOLEAN",
				required: false,
			},
		],
		en: [
			{
				name: "song",
				description: "The song or playlist to play",
				type: "STRING",
				required: true,
			},
			{
				name: "shuffle",
				description: "Whether to shuffle the playlist or not",
				type: "BOOLEAN",
				required: false,
			},
		],
	},

	runInteraction: async (interaction, translations) => {
		const isPlaying = Util.musicPlayer.isPlaying(interaction.guild.id);

		const queue = isPlaying
			? Util.musicPlayer.get(interaction.guild.id)
			: await Util.musicPlayer.create(
					(interaction.member as GuildMember).voice.channel as VoiceChannel,
					interaction.channel as TextChannel,
			  );

		let search = interaction.options.getString("song");
		const shuffle = Boolean(interaction.options.getBoolean("shuffle"));

		switch (await PlayDl.validate(search)) {
			case "yt_playlist":
			case "sp_playlist":
			case "sp_album":
			case "dz_playlist":
			case "dz_album": {
				// If the link is a playlist
				const playlist = await queue.playlist(
					search,
					interaction.member as GuildMember,
					{
						shuffle,
					},
				);

				interaction.followUp(
					translations.strings.playlist(
						playlist.videos.length.toString(),
						shuffle,
					),
				);
				break;
			}

			default: {
				// Otherwise
				try {
					const playedIn = queue.duration;
					const song = await queue.play(
						search,
						interaction.member as GuildMember,
					);

					interaction.followUp(
						translations.strings.playing(
							isPlaying,
							MusicUtil.millisecondsToTime(playedIn),
							song.name,
						),
					);
				} catch (err) {
					if (err === "InvalidSong")
						interaction.followUp(translations.strings.invalid_song());
					else throw err;
				}
			}
		}
	},
};

export default command;
