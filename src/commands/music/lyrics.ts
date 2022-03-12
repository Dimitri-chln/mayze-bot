import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

import lyricsFinder from "lyrics-finder";

const command: Command = {
	name: "lyrics",
	aliases: ["ly", "l"],
	description: {
		fr: "Obtenir les paroles de la musique actuelle",
		en: "Get the lyrics of the current song",
	},
	usage: "[<song> <artist>]",
	userPermissions: [],
	botPermissions: ["EMBED_LINKS"],

	options: {
		fr: [
			{
				name: "song",
				description: "Le nom de la musique à chercher",
				type: "STRING",
				required: false,
			},
			{
				name: "artist",
				description: "Le nom de l'artiste à chercher",
				type: "STRING",
				required: false,
			},
		],
		en: [
			{
				name: "song",
				description: "The name of the song to search for",
				type: "STRING",
				required: false,
			},
			{
				name: "artist",
				description: "The name of the artist to search for",
				type: "STRING",
				required: false,
			},
		],
	},

	runInteraction: async (interaction, translations) => {
		const song =
			interaction.options.getString("song", false) ?? Util.musicPlayer.get(interaction.guild.id)?.nowPlaying?.name;
		const artist =
			interaction.options.getString("artist", false) ?? Util.musicPlayer.get(interaction.guild.id)?.nowPlaying?.author;

		if (!song || !artist) return interaction.followUp(translations.strings.no_song());

		const lyrics: string = await lyricsFinder(song, artist);
		if (!lyrics) return interaction.followUp(translations.strings.no_lyrics());

		interaction.followUp({
			embeds: [
				{
					author: {
						name: translations.strings.author(song, artist),
						iconURL: interaction.client.user.displayAvatarURL(),
					},
					color: interaction.guild.me.displayColor,
					description: lyrics,
				},
			],
		});
	},
};

export default command;
