import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import { DatabasePlaylist } from "../../types/structures/Database";
import Util from "../../Util";

import PlayDl from "play-dl";
import { GuildMember, TextChannel, VoiceChannel } from "discord.js";

const command: Command = {
	name: "playlist",
	aliases: ["pl"],
	description: {
		fr: "Sauvegarder et jouer des playlists",
		en: "Save and play playlists",
	},
	usage:
		"list [-me] | play <name> [-shuffle] | add <name> <url> [-private] | remove <name>",
	userPermissions: [],
	botPermissions: ["EMBED_LINKS", "CONNECT", "SPEAK", "USE_EXTERNAL_EMOJIS"],

	options: {
		fr: [
			{
				name: "list",
				description: "Obtenir la liste des playlists disponibles",
				type: "SUB_COMMAND",
				options: [
					{
						name: "me",
						description: "Une option pour ne montrer que tes playlists",
						type: "BOOLEAN",
						required: false,
					},
				],
			},
			{
				name: "play",
				description: "Jouer une playlist sauvegardée",
				type: "SUB_COMMAND",
				options: [
					{
						name: "name",
						description: "Le nom de la playlist à jouer",
						type: "STRING",
						required: true,
					},
					{
						name: "shuffle",
						description: "Mélanger la playlist avant de la jouer",
						type: "BOOLEAN",
						required: false,
					},
				],
			},
			{
				name: "add",
				description: "Sauvegarder une nouvelle playlist",
				type: "SUB_COMMAND",
				options: [
					{
						name: "name",
						description: "Le nom à donner à la playlist",
						type: "STRING",
						required: true,
					},
					{
						name: "url",
						description: "Le lien de la playlist",
						type: "STRING",
						required: true,
					},
					{
						name: "private",
						description: "Sauvegarder la playlist en privé",
						type: "BOOLEAN",
						required: false,
					},
				],
			},
			{
				name: "remove",
				description: "Supprimer une playlist sauvegardée",
				type: "SUB_COMMAND",
				options: [
					{
						name: "name",
						description: "Le nom de la playlist",
						type: "STRING",
						required: true,
					},
				],
			},
		],
		en: [
			{
				name: "list",
				description: "Get the list of all available playlists",
				type: "SUB_COMMAND",
				options: [
					{
						name: "me",
						description: "An option to show your playlists only",
						type: "BOOLEAN",
						required: false,
					},
				],
			},
			{
				name: "play",
				description: "Play a saved playlist",
				type: "SUB_COMMAND",
				options: [
					{
						name: "name",
						description: "The name of the playlist to play",
						type: "STRING",
						required: true,
					},
					{
						name: "shuffle",
						description: "Whether to shuffle the playlist before playing it",
						type: "BOOLEAN",
						required: false,
					},
				],
			},
			{
				name: "add",
				description: "Save a new playlist",
				type: "SUB_COMMAND",
				options: [
					{
						name: "name",
						description: "The name to give to the playlist",
						type: "STRING",
						required: true,
					},
					{
						name: "url",
						description: "The link to the playlist",
						type: "STRING",
						required: true,
					},
					{
						name: "private",
						description: "Whether to save this playlist as private or not",
						type: "BOOLEAN",
						required: false,
					},
				],
			},
			{
				name: "remove",
				description: "Delete a saved playlist",
				type: "SUB_COMMAND",
				options: [
					{
						name: "name",
						description: "The name of the playlist",
						type: "STRING",
						required: true,
					},
				],
			},
		],
	},

	runInteraction: async (interaction, translations) => {
		const subCommand = interaction.options.getSubcommand();

		const playlistName = interaction.options.getString("name", true);
		if (!/^[\w-_]+$/.test(playlistName))
			return interaction.followUp(translations.strings.invalid_name());

		const { rows: playlists }: { rows: DatabasePlaylist[] } =
			await Util.database.query(
				"SELECT * FROM playlist WHERE NOT private OR user_id = $1 ORDER BY name ASC",
				[interaction.user.id],
			);

		switch (subCommand) {
			case "list": {
				const me = Boolean(interaction.options.getBoolean("me", false));

				interaction.followUp({
					embeds: [
						{
							author: {
								name: translations.strings.author(
									me ? interaction.user.tag : interaction.client.user.tag,
								),
								iconURL: me
									? interaction.user.displayAvatarURL({ dynamic: true })
									: interaction.client.user.displayAvatarURL(),
							},
							color: interaction.guild.me.displayColor,
							description:
								(
									await Promise.all(
										playlists
											.filter((p) =>
												me ? p.user_id === interaction.user.id : true,
											)
											.map(
												async (playlist, i) =>
													`\`${i + 1}.\` [${playlist.name}](${
														playlist.url
													}) - **${
														(
															await interaction.client.users.fetch(
																playlist.user_id,
															)
														).tag
													}**${playlist.private ? " - 🚫" : ""}`,
											),
									)
								).join("\n") ?? translations.strings.no_playlist(),
							footer: {
								text:
									"✨ Mayze ✨" +
									(playlists.some((p) => p.private)
										? translations.strings.footer_private()
										: ""),
							},
						},
					],
				});
				break;
			}

			case "play": {
				if (
					!(interaction.member as GuildMember).voice.channelId ||
					(Util.musicPlayer.get(interaction.guild.id) &&
						(interaction.member as GuildMember).voice.channelId !==
							Util.musicPlayer.get(interaction.guild.id).voiceChannel.id)
				)
					return interaction.followUp(translations.strings.not_in_vc());

				const isPlaying = Util.musicPlayer.isPlaying(interaction.guild.id);
				const queue = isPlaying
					? Util.musicPlayer.get(interaction.guild.id)
					: await Util.musicPlayer.create(
							(interaction.member as GuildMember).voice.channel as VoiceChannel,
							interaction.channel as TextChannel,
					  );

				const shuffle = Boolean(interaction.options.getBoolean("shuffle", false));
				const playlist = playlists.find((p) => p.name === playlistName);

				if (!playlist)
					return interaction.followUp(translations.strings.invalid_playlist());

				const resultPlaylist = await queue.playlist(
					playlist.url,
					interaction.member as GuildMember,
					{
						shuffle,
					},
				);

				interaction.followUp(
					translations.strings.playlist(
						resultPlaylist.videos.length.toString(),
						shuffle,
					),
				);
				break;
			}

			case "add": {
				const {
					rows: [existingPlaylist],
				}: { rows: DatabasePlaylist[] } = await Util.database.query(
					"SELECT * FROM playlist WHERE name = $1",
					[playlistName],
				);

				if (existingPlaylist)
					return interaction.followUp(
						translations.strings.playlist_already_exists(),
					);

				const url = interaction.options.getString("url", true);
				const isPrivate = Boolean(interaction.options.getBoolean("private", false));

				switch (await PlayDl.validate(url)) {
					case "yt_playlist":
					case "sp_playlist":
					case "sp_album":
					case "dz_playlist":
					case "dz_album": {
						break;
					}

					default:
						return interaction.followUp(translations.strings.invalid_url());
				}

				await Util.database.query(
					"INSERT INTO playlist VALUES ($1, $2, $3, $4)",
					[playlistName, url, interaction.user.id, isPrivate],
				);

				interaction.followUp(translations.strings.playlist_created());
				break;
			}

			case "remove": {
				if (!playlists.some((p) => p.name === playlistName))
					return interaction.followUp(translations.strings.invalid_playlist());
				if (
					!playlists.some(
						(p) => p.name === playlistName && p.user_id === interaction.user.id,
					)
				)
					return interaction.followUp(translations.strings.not_allowed());

				await Util.database.query(
					`DELETE FROM playlist WHERE user_id = $1 AND name = $2`,
					[interaction.user.id, playlistName],
				);

				interaction.followUp(translations.strings.playlist_deleted());
				break;
			}
		}
	},
};

export default command;
