const { Message } = require("discord.js");

const command = {
	name: "download",
	description: {
		fr: "Télécharger une musique ou une playlist depuis Youtube",
		en: "Download a song or a playlist from Youtube"
	},
	aliases: ["dl"],
	args: 1,
	usage: "<url>",
	botPerms: ["EMBED_LINKS", "ATTACH_FILES"],
	category: "music",
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options, language, languageCode) => {
		const Fs = require("fs");
		const zipDirectory = require("../utils/zipDirectory");
		const ytdl = require("ytdl-core");
		const { MessageEmbed, MessageAttachment } = require("discord.js");
		const Util = require("../utils/music/Util");
		const YouTubeClient = require("@sushibtw/youtubei");
		const YouTube = new YouTubeClient.Client();

		const RegExpList = {
			YouTubeVideo: /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/,
			YouTubePlaylist: /^((?:https?:)\/\/)?((?:www|m)\.)?((?:youtube\.com)).*(youtu.be\/|list=)([^#&?]*).*/,
		};

		const url = args[0];
		const type = RegExpList.YouTubeVideo.test(url) 
			? "video"
			: RegExpList.YouTubePlaylist.test(url)
				? "playlist"
				: "unknown";

		const embed = new MessageEmbed()
			.setAuthor(message.author.tag, message.author.avatarURL())
			.setTitle(language.title)
			.setColor(message.guild.me.displayColor)
			.setDescription(Util.buildBar(0, 100, 20, "━", "🔘"))
			.setFooter("✨ Mayze ✨");
		
		const msg = await message.channel.send(embed).catch(console.error);
		if (!msg) return;
		let lastProgressUpdate = Date.now();

		switch (type) {
			case "video": {
				const result = await downloadVideo(url);

				embed
					.setDescription(Util.buildBar(result.duration, result.duration, 20, "━", "🔘"))
					.setFooter(`✨ Mayze ✨ | ${language.finished}`);
				msg.edit(embed).catch(console.error);

				const buffer = Fs.readFileSync(result.path);

				await message.reply({
					files: [ new MessageAttachment(buffer, result.filename) ]
				})
					.then(() => Fs.unlinkSync(result.path))
					.catch(err => {
						if (err.code === 40005) message.channel.send(language.file_too_big).catch(console.error);
						else console.error(err);
					});
				break;
			}

			case "playlist": {
				const playlistInfo = await YouTube.getPlaylist(url);
				Fs.mkdirSync(`./downloads/${playlistInfo.title}`);

				for (const video of playlistInfo.videos)
					await downloadVideo(`https://youtube.com/watch?v=${video.id}`, playlistInfo.videos.indexOf(video), playlistInfo.videos.length, `${playlistInfo.title}/`);

				embed
					.setDescription(Util.buildBar(playlistInfo.videos.slice(-1)[0].duration * 1000, playlistInfo.videos.slice(-1)[0].duration * 1000, 20, "━", "🔘"))
					.setFooter(`✨ Mayze ✨ | ${language.finished}`);
				msg.edit(embed).catch(console.error);

				const ZIP_NAME = `./downloads/${playlistInfo.title}.zip`;
				
				await zipDirectory(`./downloads/${playlistInfo.title}`, ZIP_NAME);
				const buffer = Fs.readFileSync(ZIP_NAME);

				message.reply({
					files: [ new MessageAttachment(buffer, `${playlistInfo.title}.zip`) ]
				})
					.then(() => Fs.unlinkSync(ZIP_NAME))
					.catch(err => {
						if (err.code === 40005) message.channel.send(language.file_too_big).catch(console.error);
						else console.error(err);
					});

				Fs.rm(`./downloads/${playlistInfo.title}`, { recursive: true });
				break;
			}
			
			default:
				message.reply(language.invalid_url).catch(console.error);
		}


		function downloadVideo(url, number = 0, total = 1, dir = "") {
			return new Promise(async (resolve, reject) => {
				const info = await ytdl.getInfo(url);
				const duration = Util.TimeToMilliseconds(info.videoDetails.lengthSeconds);

				embed
					.setTitle(`${language.title} ${info.videoDetails.title} (${number + 1}/${total})`)
					.setDescription(Util.buildBar(0, duration, 20, "━", "🔘"))
					.setThumbnail(info.videoDetails.thumbnails[0].url);
				if (Date.now() - lastProgressUpdate > 1200) {
					msg.edit(embed).catch(console.error);
					lastProgressUpdate = Date.now();
				}

				ytdl(url, {
					quality: "highestaudio",
					filter: "audioonly"
				})
					.on("progress", (chunkLength, downloadedBytes, totalBytes) => {
						if (Date.now - lastProgressUpdate > 1200) {
							embed.setDescription(Util.buildBar(Util.TimeToMilliseconds((downloadedBytes / totalBytes) * parseInt(info.videoDetails.lengthSeconds)), duration, 20, "━", "🔘"));
							msg.edit(embed).catch(console.error);
							lastProgressUpdate = Date.now();
						}
					})
					.on("finish", () => {
						resolve({ path: `./downloads/${dir}${info.videoDetails.title}.mp3`, filename: `${info.videoDetails.title}.mp3`, duration });
					})
					.pipe(Fs.createWriteStream(`./downloads/${dir}${info.videoDetails.title}.mp3`));
			});
		}
	}
};

module.exports = command;