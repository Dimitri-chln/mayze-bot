import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import Translations from "../../types/structures/Translations";
import Util from "../../Util";

import Fs from "fs";
import Path from "path";
import zipDirectory from "../../utils/misc/zipDirectory";
import ytdl, { downloadOptions } from "ytdl-core";
import { MessageEmbed, MessageAttachment } from "discord.js";
import MusicUtil from "../../utils/music/MusicUtil";
import YouTubeClient from "@sushibtw/youtubei";


const command: Command = {
	name: "download",
	description: {
		fr: "Télécharger une musique ou une playlist depuis YouTube",
		en: "Download a song or a playlist from YouTube"
	},
	userPermissions: [],
	botPermissions: ["EMBED_LINKS", "ATTACH_FILES"],
	
	options: {
		fr: [
			{
				name: "url",
				description: "L'URL de la vidéo ou playlist YouTube",
				type: "STRING",
				required: true
			},
			{
				name: "type",
				description: "Le type de fichier à télécharger",
				type: "STRING",
				required: false,
				choices: [
					{
						name: "MP3 - Audio uniquement",
						value: "mp3"
					},
					{
						name: "MP4 - Audio et vidéo",
						value: "mp4"
					}
				]
			}
		],
		en: [
			{
				name: "url",
				description: "The URL of the YouTube video or playlist",
				type: "STRING",
				required: false
			},
			{
				name: "type",
				description: "The type of file to download",
				type: "STRING",
				required: false,
				choices: [
					{
						name: "MP3 - Audio only",
						value: "mp3"
					},
					{
						name: "MP4 - Video and audio",
						value: "mp4"
					}
				]
			}
		]
	},
	
	run: async (interaction, translations) => {
		const YouTube = new YouTubeClient.Client();

		const REGEX_LIST = {
			YOUTUBE_VIDEO: /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/,
			YOUTUBE_PLAYLIST: /^((?:https?:)\/\/)?((?:www|m)\.)?((?:youtube\.com)).*(youtu.be\/|list=)([^#&?]*).*/,
		};

		const DOWNLOAD_OPTIONS: { "mp3": downloadOptions, "mp4": downloadOptions } = {
			"mp3": {
				quality: "highestaudio",
				filter: "audioonly"
			},
			"mp4": {
				quality: "highestvideo",
				filter: "videoandaudio"
			}
		};

		const url = interaction.options.getString("url")
			?? Util.musicPlayer.get(interaction.guild.id)?.nowPlaying?.url;

		if (!url) return interaction.reply({
			content: translations.data.no_url(),
			ephemeral: true
		});

		const fileType = interaction.options.getString("type") as "mp3" | "mp4";

		const type = REGEX_LIST.YOUTUBE_VIDEO.test(url) ? "video"
			: REGEX_LIST.YOUTUBE_PLAYLIST.test(url) ? "playlist"
			: "unknown";

		const embed = new MessageEmbed({
			author: {
				name: interaction.user.tag,
				iconURL: interaction.user.displayAvatarURL({ dynamic: true })
			},
			title: translations.data.title(),
			color: interaction.guild.me.displayColor,
			description: MusicUtil.buildBar(0, 100),
			footer: {
				text: "✨ Mayze ✨"
			}
		});
		
		const reply = await interaction.reply({
			embeds: [ embed ],
			fetchReply: true
		}) as Message;

		let lastProgressUpdate = Date.now();

		switch (type) {
			case "video": {
				const result = await downloadVideo(url);

				embed
					.setDescription(MusicUtil.buildBar(result.duration, result.duration))
					.setFooter({
						text: `✨ Mayze ✨ | ${translations.data.complete()}`
					});
				
				reply.edit({
					embeds: [ embed ]
				});

				const buffer = Fs.readFileSync(result.path);

				await interaction.followUp({
					files: [ new MessageAttachment(buffer, result.filename) ]
				})
					.catch(err => {
						if (err.code === 40005) {
							embed.setDescription(
								translations.data.file_too_big()
							);

							reply.edit({
								embeds: [ embed ]
							});
						
						} else console.error(err);
					})
					.finally(() => Fs.unlinkSync(result.path));
				break;
			}

			case "playlist": {
				const playlistInfo = await YouTube.getPlaylist(url);
				Fs.mkdirSync(
					Path.join(__dirname, "..", "..", "downloads", playlistInfo.title)
				);

				for (const video of playlistInfo.videos)
					await downloadVideo(`https://youtube.com/watch?v=${video.id}`, playlistInfo.videos.indexOf(video), playlistInfo.videos.length, `${playlistInfo.title}/`);

				embed
					.setDescription(
						MusicUtil.buildBar(playlistInfo.videos.slice(-1)[0].duration * 1000, playlistInfo.videos.slice(-1)[0].duration * 1000)
					)
					.setFooter({
						text: `✨ Mayze ✨ | ${translations.data.complete()}`
					});
				
				reply.edit({
					embeds: [ embed ]
				});

				const zipDir = Path.join(__dirname, "..", "..", "downloads", playlistInfo.title);
				const zipName = Path.join(__dirname, "..", "..", "downloads", `${playlistInfo.title}.zip`);
				
				await zipDirectory(
					Path.join(__dirname, "..", "..", "downloads", playlistInfo.title),
					zipName
				);

				const buffer = Fs.readFileSync(zipName);

				interaction.channel.send({
					files: [ new MessageAttachment(buffer, `${playlistInfo.title}.zip`) ]
				})
					.catch(err => {
						if (err.code === 40005) {
							embed.setDescription(
								translations.data.file_too_big()
							);

							reply.edit({
								embeds: [ embed ]
							});
						
						} else console.error(err);
					})
					.finally(() => Fs.unlinkSync(zipName));

				Fs.rmSync(zipDir, { recursive: true });
				break;
			}
			
			default:
				interaction.followUp({
					content: translations.data.invalid_url(),
					ephemeral: true
				});
		}


		function downloadVideo(url: string, songIndex = 0, totalSongs = 1, outputDirectory = ""): Promise<VideoDownloadDetails> {
			return new Promise(async (resolve, reject) => {
				const info = await ytdl.getInfo(url);
				const duration = MusicUtil.timeToMilliseconds(info.videoDetails.lengthSeconds);
				const filename = `${info.videoDetails.title}.${fileType}`;
				const path = Path.join(__dirname, "..", "..", "downloads", outputDirectory, filename);

				embed
					.setTitle(`${translations.data.title()} ${info.videoDetails.title} (${songIndex + 1}/${totalSongs})`)
					.setDescription(MusicUtil.buildBar(0, duration))
					.setThumbnail(info.videoDetails.thumbnails[0].url);
				
				if (songIndex === 1 || Date.now() - lastProgressUpdate > 2000) {
					await reply.edit({
						embeds: [ embed ]
					});

					lastProgressUpdate = Date.now();
				}

				ytdl(url, DOWNLOAD_OPTIONS[fileType])
					.on("progress", (chunkLength, downloadedBytes, totalBytes) => {
						if (Date.now() - lastProgressUpdate > 1200) {
							embed.setDescription(
								MusicUtil.buildBar((downloadedBytes / totalBytes) * duration, duration)
							);

							reply.edit({
								embeds: [ embed ]
							});

							lastProgressUpdate = Date.now();
						}
					})

					.on("finish", () => {
						resolve({
							path,
							filename,
							duration
						});
					})
					
					.pipe(Fs.createWriteStream(path));
			});
		}
	}
};



interface VideoDownloadDetails {
	path: string;
	filename: string;
	duration: number;
}


export default command;