import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

import Fs from "fs";
import Path from "path";
import PlayDl from "play-dl";
import { MessageEmbed, MessageAttachment } from "discord.js";
import MusicUtil from "../../utils/music/MusicUtil";

const command: Command = {
	name: "download",
	aliases: [],
	description: {
		fr: "Télécharger une musique depuis YouTube",
		en: "Download a song from YouTube",
	},
	usage: "",
	userPermissions: [],
	botPermissions: ["EMBED_LINKS", "ATTACH_FILES"],

	options: {
		fr: [
			{
				name: "url",
				description: "L'URL de la vidéo YouTube",
				type: "STRING",
				required: false,
			},
		],
		en: [
			{
				name: "url",
				description: "The URL of the YouTube video",
				type: "STRING",
				required: false,
			},
		],
	},

	runInteraction: async (interaction, translations) => {
		const url =
			interaction.options.getString("url") ??
			Util.musicPlayer.get(interaction.guild.id)?.nowPlaying?.url;

		if (!url) return interaction.followUp(translations.strings.no_url());

		const embed = new MessageEmbed({
			author: {
				name: translations.strings.title(),
				iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
			},
			color: interaction.guild.me.displayColor,
			description: MusicUtil.buildBar(0, 100),
			footer: {
				text: "✨ Mayze ✨",
			},
		});

		const reply = (await interaction.followUp({
			embeds: [embed],
			fetchReply: true,
		})) as Message;

		try {
			const result = await downloadVideo(url);

			embed
				.setDescription(MusicUtil.buildBar(result.duration, result.duration))
				.setFooter({
					text: `✨ Mayze ✨ | ${translations.strings.complete()}`,
				});

			reply.edit({
				embeds: [embed],
			});

			const buffer = Fs.readFileSync(result.path);

			await interaction
				.followUp({
					content: interaction.user.toString(),
					files: [new MessageAttachment(buffer, result.filename)],
				})
				.catch((err) => {
					if (err.code === 40005) {
						embed.setDescription(translations.strings.file_too_big());

						reply.edit({
							embeds: [embed],
						});
					} else console.error(err);
				})
				.finally(() => Fs.unlinkSync(result.path));
		} catch (err) {
			console.error(err);
			return interaction.followUp(translations.strings.download_error());
		}

		function downloadVideo(url: string): Promise<VideoDownloadDetails> {
			return new Promise(async (resolve, reject) => {
				const info = await PlayDl.video_info(url);
				const duration = info.video_details.durationInSec * 1000;
				const filename = `${info.video_details.title.replace(
					/[^\w\s\(\)\[\]-]/g,
					" ",
				)}.mp3`;
				const path = Path.join(__dirname, "..", "..", "downloads", filename);

				embed
					.setTitle(info.video_details.title)
					.setDescription(MusicUtil.buildBar(0, duration))
					.setThumbnail(info.video_details.thumbnails[0].url);

				await reply.edit({
					embeds: [embed],
				});

				let lastProgressUpdate = Date.now();

				const writeStream = Fs.createWriteStream(path);

				writeStream
					.on("open", async () => {
						(await PlayDl.stream(url)).stream
							.on("progress", (chunkLength, downloadedBytes, totalBytes) => {
								if (Date.now() - lastProgressUpdate > 1200) {
									embed.setDescription(
										MusicUtil.buildBar(
											(downloadedBytes / totalBytes) * duration,
											duration,
										),
									);

									reply.edit({
										embeds: [embed],
									});

									lastProgressUpdate = Date.now();
								}
							})
							.on("finish", () => {
								resolve({
									path,
									filename,
									duration,
								});
							})
							.on("error", reject)
							.pipe(writeStream);
					})

					.on("error", console.error);
			});
		}
	},
};

interface VideoDownloadDetails {
	path: string;
	filename: string;
	duration: number;
}

export default command;
